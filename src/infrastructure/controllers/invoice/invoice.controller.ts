import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { CreateInvoiceDto } from 'src/application/dtos/create-invoice.dto';
import { InvoiceHandler } from 'src/application/handlers/invoice.handler';
import { AllExceptionsFilter } from 'src/common/http-exception.filter';
import { Invoice } from 'src/domain/entities/invoice.entity';

@Controller('invoices')
@UseFilters(AllExceptionsFilter)
export class InvoiceController {
  constructor(private readonly invoiceHandler: InvoiceHandler) {}

  @Post()
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    try {
      return await this.invoiceHandler.createInvoice(createInvoiceDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create invoice: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':invoiceId/send')
  async sendInvoice(@Param('invoiceId') invoiceId: string): Promise<Invoice> {
    try {
      const sentInvoice = await this.invoiceHandler.sendInvoice(invoiceId);
      if (!sentInvoice) {
        throw new HttpException(
          `Invoice with ID ${invoiceId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return sentInvoice;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to send invoice: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':invoiceId')
  async getInvoice(@Param('invoiceId') invoiceId: string): Promise<Invoice> {
    try {
      const invoice = await this.invoiceHandler.getInvoice(invoiceId);
      if (!invoice) {
        throw new HttpException(
          `Invoice with ID ${invoiceId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return invoice;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to retrieve invoice: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async getAllInvoices(): Promise<Invoice[]> {
    try {
      return await this.invoiceHandler.getAllInvoices();
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve invoices: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('order/:orderId')
  async getInvoiceByOrderId(
    @Param('orderId') orderId: string,
  ): Promise<Invoice> {
    try {
      const invoice = await this.invoiceHandler.getInvoiceByOrderId(orderId);
      if (!invoice) {
        throw new HttpException(
          `Invoice for order ${orderId} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return invoice;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        `Failed to retrieve invoice for order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
