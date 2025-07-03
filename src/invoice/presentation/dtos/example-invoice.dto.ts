import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsNotEmpty, 
  IsNumber, 
  IsString, 
  IsOptional, 
  IsBoolean, 
  ValidateNested,
  IsArray,
  IsEmail,
  IsUUID,
  Min,
  Max
} from 'class-validator';

export class InvoiceLineDto {
  @ApiProperty({ 
    description: 'Unit measure ID', 
    example: 70 
  })
  @IsNotEmpty()
  @IsNumber()
  unit_measure_id: number;

  @ApiProperty({ 
    description: 'Invoiced quantity', 
    example: 1.000 
  })
  @IsNotEmpty()
  @IsNumber()
  invoiced_quantity: number;

  @ApiProperty({ 
    description: 'Line extension amount', 
    example: 100000.00 
  })
  @IsNotEmpty()
  @IsNumber()
  line_extension_amount: number;

  @ApiProperty({ 
    description: 'Free of charge indicator', 
    example: false 
  })
  @IsNotEmpty()
  @IsBoolean()
  free_of_charge_indicator: boolean;

  @ApiProperty({ 
    description: 'Product/service description', 
    example: 'Software license' 
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ 
    description: 'Product code', 
    example: 'SW001' 
  })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ 
    description: 'Type item identification ID', 
    example: 4 
  })
  @IsNotEmpty()
  @IsNumber()
  type_item_identification_id: number;

  @ApiProperty({ 
    description: 'Price amount', 
    example: 100000.00 
  })
  @IsNotEmpty()
  @IsNumber()
  price_amount: number;

  @ApiProperty({ 
    description: 'Base quantity', 
    example: 1 
  })
  @IsNotEmpty()
  @IsNumber()
  base_quantity: number;
}

export class EmailCcDto {
  @ApiProperty({ 
    description: 'CC email address', 
    example: 'cc@example.com' 
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
} 

export class CreateInvoiceExampleDto {
  @ApiProperty({ 
    description: 'Type of document ID', 
    example: 1,
    minimum: 1 
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  type_document_id: number;

  @ApiPropertyOptional({ 
    description: 'Resolution number', 
    example: '18760000001' 
  })
  @IsOptional()
  @IsString()
  resolution_number?: string;

  @ApiPropertyOptional({ 
    description: 'Document prefix', 
    example: 'SETP',
    maxLength: 10 
  })
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiProperty({ 
    description: 'Document number', 
    example: 1001 
  })
  @IsNotEmpty()
  @IsNumber()
  number: number;

  @ApiPropertyOptional({ 
    description: 'Issue date', 
    example: '2024-01-15',
    format: 'date' 
  })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ 
    description: 'Issue time', 
    example: '10:30:00' 
  })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiPropertyOptional({ 
    description: 'Additional notes', 
    example: 'Special delivery instructions' 
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ 
    description: 'Customer information',
    type: () => CustomerInfoDto 
  })
  @ValidateNested()
  @Type(() => CustomerInfoDto)
  customer: CustomerInfoDto;

  @ApiProperty({ 
    description: 'Legal monetary totals',
    type: () => LegalMonetaryTotalDto 
  })
  @ValidateNested()
  @Type(() => LegalMonetaryTotalDto)
  legal_monetary_totals: LegalMonetaryTotalDto;

  @ApiProperty({ 
    description: 'Invoice lines',
    type: [InvoiceLineDto],
    isArray: true 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  invoice_lines: InvoiceLineDto[];

  @ApiPropertyOptional({ 
    description: 'Send email flag', 
    example: true 
  })
  @IsOptional()
  @IsBoolean()
  sendmail?: boolean;

  @ApiPropertyOptional({ 
    description: 'CC email list',
    type: [EmailCcDto],
    isArray: true 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailCcDto)
  email_cc_list?: EmailCcDto[];
}

export class CustomerInfoDto {
  @ApiProperty({ 
    description: 'Customer identification number', 
    example: '900123456' 
  })
  @IsNotEmpty()
  @IsString()
  identification_number: string;

  @ApiProperty({ 
    description: 'Customer name', 
    example: 'ACME Corporation' 
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ 
    description: 'Verification digit', 
    example: 7,
    minimum: 0,
    maximum: 9 
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9)
  dv?: number;

  @ApiPropertyOptional({ 
    description: 'Customer email', 
    example: 'customer@acme.com' 
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Customer address', 
    example: 'Calle 123 #45-67' 
  })
  @IsOptional()
  @IsString()
  address?: string;
}

export class LegalMonetaryTotalDto {
  @ApiProperty({ 
    description: 'Line extension amount', 
    example: 100000.00 
  })
  @IsNotEmpty()
  @IsNumber()
  line_extension_amount: number;

  @ApiProperty({ 
    description: 'Tax exclusive amount', 
    example: 100000.00 
  })
  @IsNotEmpty()
  @IsNumber()
  tax_exclusive_amount: number;

  @ApiProperty({ 
    description: 'Tax inclusive amount', 
    example: 119000.00 
  })
  @IsNotEmpty()
  @IsNumber()
  tax_inclusive_amount: number;

  @ApiProperty({ 
    description: 'Payable amount', 
    example: 119000.00 
  })
  @IsNotEmpty()
  @IsNumber()
  payable_amount: number;

  @ApiPropertyOptional({ 
    description: 'Allowance total amount', 
    example: 10000.00 
  })
  @IsOptional()
  @IsNumber()
  allowance_total_amount?: number;
}