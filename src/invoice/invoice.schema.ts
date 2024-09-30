import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Invoice extends Document {
  @Prop({ required: true, unique: true })
  invoiceId: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  pdfUrl: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop()
  sentAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
