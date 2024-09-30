export interface Invoice {
  invoiceId: string;
  orderId: string;
  pdfUrl: string;
  createdAt: Date;
  sentAt?: Date;
}
