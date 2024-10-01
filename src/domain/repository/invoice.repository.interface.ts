import { Invoice } from '../entities/invoice.entity';

export interface IInvoiceRepository {
  create(orderId: string, pdfUrl: string): Promise<Invoice>;
  findAll(): Promise<Invoice[]>;
  findOne(id: string): Promise<Invoice | null>;
  findByOrderId(orderId: string): Promise<Invoice | null>;
  update(id: string, data: Partial<Invoice>): Promise<Invoice | null>;
}
