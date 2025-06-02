import { IsNumber, IsString, IsEmail } from 'class-validator';

export class CreateCompanyExternalDto {
  @IsString()
  nit: string;

  @IsString()
  digito: string;

  @IsNumber()
  type_document_identification_id: number;

  @IsNumber()
  type_organization_id: number;

  @IsNumber()
  type_regime_id: number;

  @IsNumber()
  type_liability_id: number;

  @IsString()
  business_name: string;

  @IsString()
  merchant_registration: string;

  @IsNumber()
  municipality_id: number;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;
} 