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