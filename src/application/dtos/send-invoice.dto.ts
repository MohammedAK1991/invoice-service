import { IsNotEmpty, IsString } from 'class-validator';

export class SendInvoiceDto {
  @IsNotEmpty()
  @IsString()
  invoiceId: string;
}
