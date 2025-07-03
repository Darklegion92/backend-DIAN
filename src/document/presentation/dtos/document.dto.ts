import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Min,
  Max,
  IsDateString,
  IsIn
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { VALID_DOCUMENT_TYPES } from '@/document/domain/enums/document-type.enum';

export class DocumentListQueryDto {
  @ApiProperty({ description: 'Fecha de creación inicial (YYYY-MM-DD)', required: false, example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  created_at_from?: string;

  @ApiProperty({ description: 'Fecha de creación final (YYYY-MM-DD)', required: false, example: '2025-01-31' })
  @IsOptional()
  @IsDateString()
  created_at_to?: string;

  @ApiProperty({ description: 'Prefijo del documento', required: false, example: 'FE' })
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiProperty({ description: 'Número del documento', required: false, example: '001' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({ description: 'Número de identificación del cliente', required: false, example: '12345678' })
  @IsOptional()
  @IsString()
  identification_number?: string;

  @ApiProperty({ description: 'Tipo de documento ID (1=Factura, 2=Nota Crédito, 3=Nota Débito)', required: false, example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  type_document_id?: number;

  @ApiProperty({ description: 'Página actual', default: 1, required: false, example: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ description: 'Elementos por página (máximo 100)', default: 10, required: false, example: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  per_page?: number = 10;
}

export class DocumentListHeaderDto {
  @ApiProperty({ description: 'Token de autenticación Bearer', required: true })
  @IsString()
  @IsNotEmpty()
  authorization: string;
}

export class SendDocumentElectronicDto {
  @ApiProperty({ 
    description: 'Cadena de cabecera con formato específico para la DIAN', 
    required: true, 
    example: 'header_data_string' 
  })
  @IsString()
  @IsNotEmpty()
  header: string;

  @ApiProperty({ 
    description: 'Cadena con el detalle de productos/servicios en formato específico para la DIAN', 
    required: true, 
    example: 'detail_data_string' 
  })
  @IsString()
  @IsNotEmpty()
  detail: string;

  @ApiProperty({ 
    description: 'Cadena con información de impuestos en formato específico para la DIAN', 
    required: true, 
    example: 'taxes_data_string' 
  })
  @IsString()
  @IsNotEmpty()
  taxes: string;

  @ApiProperty({ 
    description: 'Cadena con información de descuentos en formato específico para la DIAN', 
    required: true, 
    example: 'discount_data_string' 
  })
  @IsString()
  @IsOptional()
  discount: string;

  @ApiProperty({ 
    description: 'Cadena con información de pago en formato específico para la DIAN', 
    required: true, 
    example: 'payment_data_string' 
  })
  @IsString()
  @IsNotEmpty()
  payment: string;

  @ApiProperty({ 
    description: 'Cadena con información del cliente en formato específico para la DIAN', 
    required: true, 
    example: 'customer_data_string' 
  })
  @IsString()
  @IsNotEmpty()
  customer: string;

  @ApiProperty({ 
    description: 'Cadena con información de anticipos en formato específico para la DIAN', 
    required: true, 
    example: 'advance_data_string' 
  })
  @IsString()
  @IsOptional()
  advance: string;

  @ApiProperty({ 
    description: 'Cadena con información de autorización en formato específico para la DIAN', 
    required: true, 
    example: 'authorized_data_string' 
  })
  @IsString()
  @IsOptional()
  authorized: string;

  @ApiProperty({ 
    description: 'Cadena con información de entrega en formato específico para la DIAN', 
    required: true, 
    example: 'delivery_data_string' 
  })
  @IsString()
  @IsOptional()
  delivery: string;

  @ApiProperty({ 
    description: 'Cadena con condiciones de pago en formato específico para la DIAN', 
    required: true, 
    example: 'payment_condition_data_string' 
  })
  @IsString()
  @IsOptional()
  paymentCondition: string;

  @ApiProperty({ 
    description: 'Cadena con información de TRM en formato específico para la DIAN', 
    required: true, 
    example: 'trm_data_string' 
  })
  @IsString()
  @IsOptional()
  trm: string;

  @ApiProperty({ 
    description: 'Cadena con información de orden en formato específico para la DIAN', 
    required: true, 
    example: 'order_data_string' 
  })
  @IsString()
  @IsOptional()
  order: string;

  @ApiProperty({ 
    description: 'Cadena con información extra en formato específico para la DIAN', 
    required: true, 
    example: 'extra_data_string' 
  })
  @IsString()
  @IsOptional()
  extra: string;

  @ApiProperty({ 
    description: 'Número de resolución DIAN', 
    required: true, 
    example: '18766000001' 
  })
  @IsString()
  @IsNotEmpty()
  resolutionNumber: string;

  @ApiProperty({ 
    description: 'Tipo de documento (1=Invoice, 3=Invoice Contingency, 4=Credit Note, 11=Support Document, 13=Credit Note Document Support)', 
    required: true, 
    example: 1,
    enum: [1, 3, 4, 11, 13]
  })
  @IsNumber()
  @IsNotEmpty()
  @IsIn(VALID_DOCUMENT_TYPES, { message: 'El tipo de documento debe ser: 1 (Invoice), 3 (Invoice Contingency), 4 (Credit Note), 11 (Support Document), o 13 (Credit Note Document Support)' })
  typeDocumentId: number;

  @ApiProperty({ 
    description: 'NIT de la empresa', 
    required: true, 
    example: '900123456' 
  })
  @IsString()
  @IsNotEmpty()
  nit: string;

  @ApiProperty({ 
    description: 'Número del documento', 
    required: true, 
    example: '001' 
  })
  @IsString()
  @IsNotEmpty()
  number: string;
}

export class SendDocumentElectronicResponseDto {
  @ApiProperty({ 
    description: 'CUFE (Código Único de Facturación Electrónica)', 
    example: '242ce5e27513a17745451897097055f930ca5c5f3f2fe9c0a11e78976ad900e577297ec7e3ca55d8b2c506068195146a' 
  })
  cufe: string;

  @ApiProperty({ 
    description: 'Fecha y hora de procesamiento del documento (máximo 20 caracteres)', 
    example: '2025-01-15 10:30:00' 
  })
  date: string;

  @ApiProperty({ 
    description: 'Documento PDF en formato base64', 
    example: 'JVBERi0xLjcKCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDI...' 
  })
  document: string;
}