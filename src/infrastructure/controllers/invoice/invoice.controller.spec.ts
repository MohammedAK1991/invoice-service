import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from 'src/application/services/invoice/invoice.service';
import { CreateInvoiceDto } from 'src/application/dtos/create-invoice.dto';
import { Invoice } from 'src/domain/entities/invoice.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('InvoiceController', () => {
  let controller: InvoiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('InvoiceController', () => {
    let controller: InvoiceController;
    let service: InvoiceService;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [InvoiceController],
        providers: [
          {
            provide: InvoiceService,
            useValue: {
              createInvoice: jest.fn(),
              sendInvoice: jest.fn(),
              getInvoice: jest.fn(),
              getAllInvoices: jest.fn(),
              getInvoiceByOrderId: jest.fn(),
            },
          },
        ],
      }).compile();

      controller = module.get<InvoiceController>(InvoiceController);
      service = module.get<InvoiceService>(InvoiceService);
    });

    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    describe('createInvoice', () => {
      it('should create an invoice', async () => {
        const createInvoiceDto: CreateInvoiceDto = {
          orderId: '1',
          pdfUrl: 'url',
        };
        const result: Invoice = {
          id: '1',
          orderId: '1',
          pdfUrl: 'url',
        } as Invoice;
        jest.spyOn(service, 'createInvoice').mockResolvedValue(result);

        expect(await controller.createInvoice(createInvoiceDto)).toBe(result);
      });

      it('should throw an exception if creation fails', async () => {
        const createInvoiceDto: CreateInvoiceDto = {
          orderId: '1',
          pdfUrl: 'url',
        };
        jest
          .spyOn(service, 'createInvoice')
          .mockRejectedValue(new Error('Failed'));

        await expect(
          controller.createInvoice(createInvoiceDto),
        ).rejects.toThrow(
          new HttpException(
            'Failed to create invoice: Failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });

    describe('sendInvoice', () => {
      it('should send an invoice', async () => {
        const result: Invoice = { id: '1', orderId: '1', pdfUrl: 'url' };
        jest.spyOn(service, 'sendInvoice').mockResolvedValue(result);

        expect(await controller.sendInvoice('1')).toBe(result);
      });

      it('should throw an exception if invoice not found', async () => {
        jest.spyOn(service, 'sendInvoice').mockResolvedValue(null);

        await expect(controller.sendInvoice('1')).rejects.toThrow(
          new HttpException(
            'Invoice with ID 1 not found',
            HttpStatus.NOT_FOUND,
          ),
        );
      });

      it('should throw an exception if sending fails', async () => {
        jest
          .spyOn(service, 'sendInvoice')
          .mockRejectedValue(new Error('Failed'));

        await expect(controller.sendInvoice('1')).rejects.toThrow(
          new HttpException(
            'Failed to send invoice: Failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });

    describe('getInvoice', () => {
      it('should return an invoice', async () => {
        const result: Invoice = { id: '1', orderId: '1', pdfUrl: 'url' };
        jest.spyOn(service, 'getInvoice').mockResolvedValue(result);

        expect(await controller.getInvoice('1')).toBe(result);
      });

      it('should throw an exception if invoice not found', async () => {
        jest.spyOn(service, 'getInvoice').mockResolvedValue(null);

        await expect(controller.getInvoice('1')).rejects.toThrow(
          new HttpException(
            'Invoice with ID 1 not found',
            HttpStatus.NOT_FOUND,
          ),
        );
      });

      it('should throw an exception if retrieval fails', async () => {
        jest
          .spyOn(service, 'getInvoice')
          .mockRejectedValue(new Error('Failed'));

        await expect(controller.getInvoice('1')).rejects.toThrow(
          new HttpException(
            'Failed to retrieve invoice: Failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });

    describe('getAllInvoices', () => {
      it('should return all invoices', async () => {
        const result: Invoice[] = [{ id: '1', orderId: '1', pdfUrl: 'url' }];
        jest.spyOn(service, 'getAllInvoices').mockResolvedValue(result);

        expect(await controller.getAllInvoices()).toBe(result);
      });

      it('should throw an exception if retrieval fails', async () => {
        jest
          .spyOn(service, 'getAllInvoices')
          .mockRejectedValue(new Error('Failed'));

        await expect(controller.getAllInvoices()).rejects.toThrow(
          new HttpException(
            'Failed to retrieve invoices: Failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });

    describe('getInvoiceByOrderId', () => {
      it('should return an invoice by order ID', async () => {
        const result: Invoice = { id: '1', orderId: '1', pdfUrl: 'url' };
        jest.spyOn(service, 'getInvoiceByOrderId').mockResolvedValue(result);

        expect(await controller.getInvoiceByOrderId('1')).toBe(result);
      });

      it('should throw an exception if invoice not found', async () => {
        jest.spyOn(service, 'getInvoiceByOrderId').mockResolvedValue(null);

        await expect(controller.getInvoiceByOrderId('1')).rejects.toThrow(
          new HttpException(
            'Invoice for order 1 not found',
            HttpStatus.NOT_FOUND,
          ),
        );
      });

      it('should throw an exception if retrieval fails', async () => {
        jest
          .spyOn(service, 'getInvoiceByOrderId')
          .mockRejectedValue(new Error('Failed'));

        await expect(controller.getInvoiceByOrderId('1')).rejects.toThrow(
          new HttpException(
            'Failed to retrieve invoice for order: Failed',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      });
    });
  });
});
