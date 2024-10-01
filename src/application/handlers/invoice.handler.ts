import { Injectable } from '@nestjs/common';
import { InvoiceService } from '../services/invoice/invoice.service';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { Invoice } from '../../domain/entities/invoice.entity';

@Injectable()
export class InvoiceHandler {
  constructor(private readonly invoiceService: InvoiceService) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.createInvoice(
      createInvoiceDto.orderId,
      createInvoiceDto.pdfUrl,
    );
  }

  async sendInvoice(invoiceId: string): Promise<Invoice> {
    return this.invoiceService.sendInvoice(invoiceId);
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    return this.invoiceService.getInvoice(invoiceId);
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceService.getAllInvoices();
  }

  async getInvoiceByOrderId(orderId: string): Promise<Invoice> {
    return this.invoiceService.getInvoiceByOrderId(orderId);
  }
}
