import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  Min,
  Max,
  IsDateString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

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
    description: 'Token de autenticación DIAN',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  tokenDian: string;

  @ApiProperty({
    description: 'Cadena de cabecera',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  header: string;

  @ApiProperty({
    description: 'Cadena de detalle',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  detail: string;

  @ApiProperty({
    description: 'Cadena de impuestos',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  taxes: string;

  @ApiProperty({
    description: 'Cadena de pago',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  payment: string;

  @ApiProperty({
    description: 'Cadena de cliente',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  customer: string;

  @ApiProperty({
    description: 'Número de resolución DIAN',
    example: '18764000001',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  resolutionNumber: string;

  @ApiProperty({
    description: 'NIT de la empresa',
    example: '123456789',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  nit: string;

  @ApiProperty({
    description: 'Tipo de documento (1=Factura, 2=Nota Crédito, 3=Nota Débito)',
    example: 1,
    required: true,
    type: Number
  })
  @IsNumber()
  @Min(1)
  @Max(3)
  typeDocumentId: number;
} 