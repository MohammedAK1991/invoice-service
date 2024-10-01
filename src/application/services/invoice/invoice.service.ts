import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { SUBSCRIPTION_NAME } from '../../../common/constants';
import { PubSubService } from '../../../common/pubsub/pubsub.service';
import { InvoiceNotFoundError } from '../../../domain/errors/invoice-not-found.error';
import { IInvoiceRepository } from '../../../domain/repository/invoice.repository.interface';

@Injectable()
export class InvoiceService implements OnModuleInit {
  constructor(
    private readonly pubSubService: PubSubService,
    @Inject('IInvoiceRepository')
    private readonly invoiceRepository: IInvoiceRepository,
  ) {}

  onModuleInit() {
    this.listenForOrderEvents();
  }

  async createInvoice(orderId: string, pdfUrl: string): Promise<Invoice> {
    return this.invoiceRepository.create(orderId, pdfUrl);
  }

  async sendInvoice(invoiceId: string): Promise<Invoice | null> {
    const invoice = await this.invoiceRepository.findOne(invoiceId);
    if (!invoice) {
      throw new InvoiceNotFoundError(`Invoice with ID ${invoiceId} not found`);
    }
    return this.invoiceRepository.update(invoiceId, { sentAt: new Date() });
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne(invoiceId);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }
    return invoice;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceRepository.findAll();
  }

  async getInvoiceByOrderId(orderId: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findByOrderId(orderId);
    if (!invoice) {
      throw new InvoiceNotFoundError(`Invoice for order ${orderId} not found`);
    }
    return invoice;
  }

  private listenForOrderEvents(): void {
    this.pubSubService.subscribe(SUBSCRIPTION_NAME, async (message) => {
      console.log('Received message:', message.data.toString());
      const orderEvent = JSON.parse(message.data.toString());

      if (orderEvent.status === 'Shipped') {
        try {
          const invoice = await this.getInvoiceByOrderId(orderEvent.orderId);
          await this.sendInvoice(invoice.id);
          console.log(`Invoice sent for order ${orderEvent.orderId}`);
        } catch (error) {
          console.error('Error processing order event:', error);
        }
      }
    });

    console.log('Listening for order events...');
  }
}
