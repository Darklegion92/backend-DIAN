import { 
  IsNumber, 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  Length, 
  Matches, 
  IsPositive,
  Min,
  Max,
  IsOptional
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyExternalDto {
  @ApiProperty({
    description: 'Número de Identificación Tributaria (NIT) sin dígito de verificación',
    example: '900123456',
    minLength: 8,
    maxLength: 15,
    pattern: '^[0-9]+$',
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 15)
  @Matches(/^[0-9]+$/, { message: 'El NIT debe contener solo números' })
  nit: string;

  @ApiProperty({
    description: 'Dígito de verificación del NIT',
    example: '7',
    minLength: 1,
    maxLength: 1,
    pattern: '^[0-9]$',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 1)
  @Matches(/^[0-9]$/, { message: 'El dígito debe ser un número del 0 al 9' })
  digito: string;

  @ApiProperty({
    description: 'ID del tipo de documento de identificación según catálogo DIAN',
    example: 6,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber({}, { message: 'Debe ser un número válido' })
  @IsPositive({ message: 'Debe ser un número positivo' })
  @Min(1)
  @Max(100)
  type_document_identification_id: number;

  @ApiProperty({
    description: 'ID del tipo de organización según catálogo DIAN',
    example: 2,
    minimum: 1,
    maximum: 50,
  })
  @IsNumber({}, { message: 'Debe ser un número válido' })
  @IsPositive({ message: 'Debe ser un número positivo' })
  @Min(1)
  @Max(50)
  type_organization_id: number;

  @ApiProperty({
    description: 'ID del tipo de régimen tributario según catálogo DIAN',
    example: 2,
    minimum: 1,
    maximum: 10,
  })
  @IsNumber({}, { message: 'Debe ser un número válido' })
  @IsPositive({ message: 'Debe ser un número positivo' })
  @Min(1)
  @Max(10)
  type_regime_id: number;

  @ApiProperty({
    description: 'ID del tipo de responsabilidad tributaria según catálogo DIAN',
    example: 14,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber({}, { message: 'Debe ser un número válido' })
  @IsPositive({ message: 'Debe ser un número positivo' })
  @Min(1)
  @Max(100)
  type_liability_id: number;

  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'EMPRESA EJEMPLO S.A.S.',
    minLength: 2,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 255)
  business_name: string;

  @ApiProperty({
    description: 'Número de matrícula mercantil en la cámara de comercio',
    example: '12345678',
    minLength: 6,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  merchant_registration: string;

  @ApiProperty({
    description: 'ID del municipio según catálogo DIAN',
    example: 149,
    minimum: 1,
    maximum: 9999,
  })
  @IsNumber({}, { message: 'Debe ser un número válido' })
  @IsPositive({ message: 'Debe ser un número positivo' })
  @Min(1)
  @Max(9999)
  municipality_id: number;

  @ApiProperty({
    description: 'Dirección física de la empresa',
    example: 'Carrera 123 #45-67, Oficina 801',
    minLength: 10,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @Length(10, 255)
  address: string;

  @ApiProperty({
    description: 'Número de teléfono de contacto de la empresa (incluyendo código de país)',
    example: '+57 1 123 4567',
    minLength: 7,
    maxLength: 20,
    pattern: '^[+]?[0-9\\s\\-()]{7,20}$',
  })
  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  @Matches(/^[+]?[0-9\s\-()]{7,20}$/, { 
    message: 'El teléfono debe tener un formato válido' 
  })
  phone: string;

  @ApiProperty({
    description: 'Correo electrónico corporativo de la empresa',
    example: 'contacto@empresaejemplo.com',
    format: 'email',
    maxLength: 100,
  })
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  @IsNotEmpty()
  @Length(5, 100)
  email: string;

  @ApiProperty({
    description: 'Servidor de correo electrónico para RADIAN',
    example: 'imap.gmail.com',
  })
  @IsOptional()
  @IsString()
  imap_server: string;

  @ApiProperty({
    description: 'Usuario de correo electrónico para RADIAN',
    example: 'usuario@gmail.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo electrónico válido' })
  imap_user: string;

  @ApiProperty({
    description: 'Contraseña SMTP de correo electrónico para RADIAN',
    example: '1234567890',
  })
  @IsOptional()
  @IsString()
  imap_password: string;

  @ApiProperty({
    description: 'Encriptación de correo electrónico para RADIAN',
    example: 'SSL',
  })
  @IsOptional()
  @IsString()
  imap_encryption: string;

  @ApiProperty({
    description: 'Encriptación de correo electrónico para RADIAN',
    example: 'SSL',
  })
  @IsOptional()
  @IsString()
  imap_port: string;
} 