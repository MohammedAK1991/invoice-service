import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Invoice } from './invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>,
  ) {}

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
      throw new NotFoundException(`Invoice with ID ${invoiceId} not found`);
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
      throw new NotFoundException(`Invoice for order ${orderId} not found`);
    }
    return invoice;
  }
}
