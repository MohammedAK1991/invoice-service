import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PubSubModule } from './common/pubsub/pubsub.module';
import { InvoiceModule } from './invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URI,
      }),
    }),
    InvoiceModule,
    PubSubModule,
  ],
})
export class AppModule {}
