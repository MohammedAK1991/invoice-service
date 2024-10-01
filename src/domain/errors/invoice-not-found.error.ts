export class InvoiceNotFoundError extends Error {
  constructor(id: string) {
    super(`Invoice with ID ${id} not found`);
    this.name = 'InvoiceNotFoundError';
  }
}
