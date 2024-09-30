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
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './interfaces/invoice.interface';
import { AllExceptionsFilter } from '../common/http-exception.filter';

@Controller('invoices')
@UseFilters(AllExceptionsFilter)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<Invoice> {
    try {
      return await this.invoiceService.createInvoice(
        createInvoiceDto.orderId,
        createInvoiceDto.pdfUrl,
      );
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
      const sentInvoice = await this.invoiceService.sendInvoice(invoiceId);
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
      const invoice = await this.invoiceService.getInvoice(invoiceId);
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
      return await this.invoiceService.getAllInvoices();
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
      const invoice = await this.invoiceService.getInvoiceByOrderId(orderId);
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
