import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceService } from './application/services/invoice/invoice.service';
import { Invoice, InvoiceSchema } from './domain/entities/invoice.entity';
import { InvoiceController } from './infrastructure/controllers/invoice/invoice.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
