import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Invoice } from '../../../domain/entities/invoice.entity';
import { SUBSCRIPTION_NAME } from 'src/common/constants';
import { PubSubService } from 'src/common/pubsub/pubsub.service';
import { InvoiceNotFoundError } from 'src/domain/errors/invoice-not-found.error';

@Injectable()
export class InvoiceService implements OnModuleInit {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
    private readonly pubSubService: PubSubService,
  ) {}

  onModuleInit() {
    this.listenForOrderEvents();
  }

  async createInvoice(orderId: string, pdfUrl: string): Promise<Invoice> {
    const invoice = new this.invoiceModel({
      invoiceId: uuidv4(),
      orderId,
      pdfUrl,
      createdAt: new Date(),
    });
    return invoice.save();
  }

  async sendInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ invoiceId });
    if (!invoice) {
      throw new InvoiceNotFoundError(
        `Invoice for order ${invoiceId} not found`,
      );
    }
    invoice.sentAt = new Date();
    return invoice.save();
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ invoiceId });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
    }
    return invoice;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async getInvoiceByOrderId(orderId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ orderId });
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
          await this.sendInvoice(invoice.invoiceId);
          console.log(`Invoice sent for order ${orderEvent.orderId}`);
        } catch (error) {
          console.error('Error processing order event:', error);
        }
      }
    });

    console.log('Listening for order events...');
  }
}
