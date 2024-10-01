import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { MongoDBInvoiceRepository } from './infrastructure/repositories/mongodb-invoice.repository';
import { Invoice, InvoiceSchema } from './domain/entities/invoice.entity';
import { InvoiceService } from './application/services/invoice/invoice.service';
import { InvoiceHandler } from './application/handlers/invoice.handler';
import { InvoiceController } from './infrastructure/controllers/invoice/invoice.controller';
import { PubSubService } from './common/pubsub/pubsub.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    PubSubModule,
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceHandler,
    InvoiceService,
    PubSubService,
    {
      provide: 'IInvoiceRepository',
      useClass: MongoDBInvoiceRepository,
    },
  ],
})
export class InvoiceModule {}
