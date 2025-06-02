import { IsString, IsBoolean, IsArray, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @IsString()
  @IsNotEmpty()
  identification_number: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class PaymentFormDto {
  @IsString()
  @IsNotEmpty()
  payment_form_id: string;

  @IsString()
  @IsOptional()
  payment_method_code?: string;

  @IsString()
  @IsOptional()
  payment_due_date?: string;
}

export class LegalMonetaryTotalsDto {
  @IsString()
  @IsNotEmpty()
  line_extension_amount: string;

  @IsString()
  @IsNotEmpty()
  tax_exclusive_amount: string;

  @IsString()
  @IsNotEmpty()
  tax_inclusive_amount: string;

  @IsString()
  @IsOptional()
  allowance_total_amount?: string;

  @IsString()
  @IsNotEmpty()
  payable_amount: string;
}

export class TaxTotalDto {
  @IsString()
  @IsNotEmpty()
  tax_id: string;

  @IsString()
  @IsNotEmpty()
  tax_amount: string;

  @IsString()
  @IsOptional()
  percent?: string;

  @IsString()
  @IsOptional()
  taxable_amount?: string;
}

export class InvoiceLineDto {
  @IsString()
  @IsNotEmpty()
  unit_measure_id: string;

  @IsString()
  @IsNotEmpty()
  invoiced_quantity: string;

  @IsString()
  @IsNotEmpty()
  line_extension_amount: string;

  @IsString()
  @IsNotEmpty()
  free_of_charge_indicator: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  price_amount: string;

  @IsString()
  @IsNotEmpty()
  base_quantity: string;
}

export class AllowanceChargesDto {
  @IsString()
  @IsNotEmpty()
  charge_indicator: string;

  @IsString()
  @IsOptional()
  allowance_charge_reason?: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsOptional()
  base_amount?: string;
}

export class EmailCCListDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  type_document_id: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsNotEmpty()
  resolution_number: string;

  @IsString()
  @IsNotEmpty()
  prefix: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  @IsNotEmpty()
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => PaymentFormDto)
  @IsNotEmpty()
  payment_form: PaymentFormDto;

  @ValidateNested()
  @Type(() => LegalMonetaryTotalsDto)
  @IsNotEmpty()
  legal_monetary_totals: LegalMonetaryTotalsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxTotalDto)
  @IsOptional()
  with_holding_tax_total?: TaxTotalDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxTotalDto)
  @IsNotEmpty()
  tax_totals: TaxTotalDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  @IsNotEmpty()
  invoice_lines: InvoiceLineDto[];

  @IsBoolean()
  @IsOptional()
  sendmail?: boolean = true;

  @IsBoolean()
  @IsOptional()
  send_customer_credentials?: boolean = false;

  @IsString()
  @IsOptional()
  AdditionalDocumentReferenceID?: string;

  @IsString()
  @IsOptional()
  AdditionalDocumentReferenceDate?: string;

  @IsString()
  @IsOptional()
  AdditionalDocumentReferenceTypeDocument?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowanceChargesDto)
  @IsOptional()
  allowance_charges?: AllowanceChargesDto[];

  @IsString()
  @IsOptional()
  head_note?: string;

  @IsString()
  @IsOptional()
  seze?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailCCListDto)
  @IsOptional()
  email_cc_list?: EmailCCListDto[];
} 