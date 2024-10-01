import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { PubSubService } from '../../../common/pubsub/pubsub.service';
import { IInvoiceRepository } from '../../../domain/repository/invoice.repository.interface';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { InvoiceNotFoundError } from '../../../domain/errors/invoice-not-found.error';
import { NotFoundException } from '@nestjs/common';
import { SUBSCRIPTION_NAME } from '../../../common/constants';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let pubSubService: jest.Mocked<PubSubService>;
  let invoiceRepository: jest.Mocked<IInvoiceRepository>;

  const mockInvoice: Invoice = {
    id: '1',
    orderId: 'order1',
    pdfUrl: 'http://example.com/invoice.pdf',
    createdAt: new Date(),
    sentAt: null,
  } as Invoice;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: PubSubService,
          useValue: {
            subscribe: jest.fn(),
          },
        },
        {
          provide: 'IInvoiceRepository',
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByOrderId: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    pubSubService = module.get(PubSubService);
    invoiceRepository = module.get('IInvoiceRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create an invoice', async () => {
      invoiceRepository.create.mockResolvedValue(mockInvoice);

      const result = await service.createInvoice(
        'order1',
        'http://example.com/invoice.pdf',
      );

      expect(result).toEqual(mockInvoice);
      expect(invoiceRepository.create).toHaveBeenCalledWith(
        'order1',
        'http://example.com/invoice.pdf',
      );
    });
  });

  describe('sendInvoice', () => {
    it('should send an invoice', async () => {
      const sentInvoice = { ...mockInvoice, sentAt: new Date() };
      invoiceRepository.findOne.mockResolvedValue(mockInvoice);
      invoiceRepository.update.mockResolvedValue(sentInvoice as Invoice);

      const result = await service.sendInvoice('1');

      expect(result).toEqual(sentInvoice);
      expect(invoiceRepository.findOne).toHaveBeenCalledWith('1');
      expect(invoiceRepository.update).toHaveBeenCalledWith('1', {
        sentAt: expect.any(Date),
      });
    });

    it('should throw InvoiceNotFoundError if invoice is not found', async () => {
      invoiceRepository.findOne.mockResolvedValue(null);

      await expect(service.sendInvoice('1')).rejects.toThrow(
        InvoiceNotFoundError,
      );
    });
  });

  describe('getInvoice', () => {
    it('should get an invoice', async () => {
      invoiceRepository.findOne.mockResolvedValue(mockInvoice);

      const result = await service.getInvoice('1');

      expect(result).toEqual(mockInvoice);
      expect(invoiceRepository.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if invoice is not found', async () => {
      invoiceRepository.findOne.mockResolvedValue(null);

      await expect(service.getInvoice('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllInvoices', () => {
    it('should get all invoices', async () => {
      invoiceRepository.findAll.mockResolvedValue([mockInvoice]);

      const result = await service.getAllInvoices();

      expect(result).toEqual([mockInvoice]);
      expect(invoiceRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('getInvoiceByOrderId', () => {
    it('should get an invoice by order id', async () => {
      invoiceRepository.findByOrderId.mockResolvedValue(mockInvoice);

      const result = await service.getInvoiceByOrderId('order1');

      expect(result).toEqual(mockInvoice);
      expect(invoiceRepository.findByOrderId).toHaveBeenCalledWith('order1');
    });

    it('should throw InvoiceNotFoundError if invoice is not found', async () => {
      invoiceRepository.findByOrderId.mockResolvedValue(null);

      await expect(service.getInvoiceByOrderId('order1')).rejects.toThrow(
        InvoiceNotFoundError,
      );
    });
  });

  describe('onModuleInit', () => {
    it('should subscribe to order events', () => {
      service.onModuleInit();

      expect(pubSubService.subscribe).toHaveBeenCalledWith(
        SUBSCRIPTION_NAME,
        expect.any(Function),
      );
    });

    it('should process "Shipped" order events', async () => {
      let subscribeCallback: (message: any) => void;
      pubSubService.subscribe.mockImplementation(async (topic, callback) => {
        subscribeCallback = callback;
      });

      service.onModuleInit();

      const mockMessage = {
        data: JSON.stringify({ status: 'Shipped', orderId: 'order1' }),
      };

      invoiceRepository.findByOrderId.mockResolvedValue(mockInvoice);
      invoiceRepository.findOne.mockResolvedValue(mockInvoice);
      invoiceRepository.update.mockResolvedValue({
        ...mockInvoice,
        sentAt: new Date(),
      } as Invoice);

      await subscribeCallback(mockMessage);

      expect(invoiceRepository.findByOrderId).toHaveBeenCalledWith('order1');
      expect(invoiceRepository.findOne).toHaveBeenCalledWith('1');
      expect(invoiceRepository.update).toHaveBeenCalledWith('1', {
        sentAt: expect.any(Date),
      });
    });
  });
});
