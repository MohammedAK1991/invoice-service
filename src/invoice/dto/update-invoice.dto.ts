import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateInvoiceDto {
  @IsOptional()
  @IsString()
  @IsUrl()
  pdfUrl?: string;
}
