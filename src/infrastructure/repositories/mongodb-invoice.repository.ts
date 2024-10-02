import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IInvoiceRepository } from '../../domain/repository/invoice.repository.interface';
import { Invoice } from '../../domain/entities/invoice.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MongoDBInvoiceRepository implements IInvoiceRepository {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {}

  async create(orderId: string, pdfUrl: string): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel({
      invoiceId: uuidv4(),
      orderId,
      pdfUrl,
      createdAt: new Date(),
    });
    return createdInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice | null> {
    return this.invoiceModel.findById(id).exec();
  }

  async findByOrderId(orderId: string): Promise<Invoice | null> {
    return this.invoiceModel.findOne({ orderId }).exec();
  }

  async update(id: string, data: Partial<Invoice>): Promise<Invoice | null> {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }
}
