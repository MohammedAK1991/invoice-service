import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  @IsUrl()
  pdfUrl: string;
}
