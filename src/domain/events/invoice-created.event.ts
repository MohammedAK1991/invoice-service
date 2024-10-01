import { Invoice } from '../entities/invoice.entity';

export class InvoiceCreatedEvent {
  constructor(public readonly invoice: Invoice) {}
}
