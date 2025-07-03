import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CustomerDataDto {
  @ApiProperty({ description: 'Customer identification number', example: '900123456' })
  @IsNotEmpty()
  @IsString()
  identification_number: string;
  name: string;
  dv?: number;
  type_document_identification_id?: number;
  type_organization_id?: number;
  language_id?: number;
  country_id?: number;
  municipality_id?: number;
  municipality_id_fact?: string;
  first_name?: string;
  family_first_surname?: string;
  family_second_surname?: string;
  middle_name?: string;
  address?: string;
  email?: string;
  phone?: string;
  merchant_registration?: string;
  
  // Datos de la empresa del cliente
  business_name?: string;
  type_regime_id?: number;
  type_liability_id?: number;
}

export class DeliveryDataDto {
  @ApiPropertyOptional({ description: 'Language ID', example: 1 })
  @IsOptional()
  @IsNumber()
  language_id?: number;

  @ApiPropertyOptional({ description: 'Country ID', example: 1 })
  @IsOptional()
  @IsNumber()
  country_id?: number;

  @ApiPropertyOptional({ description: 'Municipality ID', example: 1 })
  @IsOptional()
  @IsNumber()
  municipality_id?: number;

  @ApiProperty({ description: 'Delivery address', example: 'Calle 123 #45-67' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ description: 'Actual delivery date', example: '2024-01-15' })
  @IsNotEmpty()
  @IsString()
  actual_delivery_date: string;
}

export class DeliveryPartyDataDto {
  @ApiProperty({ description: 'Identification number', example: '900123456' })
  @IsNotEmpty()
  @IsString()
  identification_number: string;

  @ApiPropertyOptional({ description: 'Verification digit', example: 7 })
  @IsOptional()
  @IsNumber()
  dv?: number;

  @ApiPropertyOptional({ description: 'Document type ID', example: 1 })
  @IsOptional()
  @IsNumber()
  type_document_identification_id?: number;

  @ApiPropertyOptional({ description: 'Organization type ID', example: 1 })
  @IsOptional()
  @IsNumber()
  type_organization_id?: number;

  @ApiPropertyOptional({ description: 'Language ID', example: 1 })
  @IsOptional()
  @IsNumber()
  language_id?: number;

  @ApiPropertyOptional({ description: 'Country ID', example: 1 })
  @IsOptional()
  @IsNumber()
  country_id?: number;

  @ApiPropertyOptional({ description: 'Municipality ID', example: 1 })
  @IsOptional()
  @IsNumber()
  municipality_id?: number;

  @ApiPropertyOptional({ description: 'Regime type ID', example: 1 })
  @IsOptional()
  @IsNumber()
  type_regime_id?: number;

  @ApiPropertyOptional({ description: 'Tax ID', example: 1 })
  @IsOptional()
  @IsNumber()
  tax_id?: number;

  @ApiPropertyOptional({ description: 'Liability type ID', example: 1 })
  @IsOptional()
  @IsNumber()
  type_liability_id?: number;

  @ApiPropertyOptional({ description: 'Party name', example: 'Transport Company' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Phone number', example: '+57 300 123 4567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Address', example: 'Calle 123 #45-67' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'party@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Merchant registration', example: 'REG123456' })
  @IsOptional()
  @IsString()
  merchant_registration?: string;
} 