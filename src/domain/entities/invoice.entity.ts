import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Invoice extends Document {
  @Prop({ required: true, unique: true, default: uuidv4 })
  invoiceId: string;

  @Prop({ required: true })
  orderId: string;

  @Prop({ required: true })
  pdfUrl: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;

  @Prop()
  sentAt: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
