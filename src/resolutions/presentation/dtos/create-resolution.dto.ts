import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsDateString, IsOptional } from 'class-validator';

export class CreateResolutionDto {
  @ApiProperty({
    description: 'ID del tipo de documento',
    example: 1,
    minimum: 1,
  })
  @IsNumber({}, { message: 'El tipo de documento debe ser un número' })
  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @Min(1, { message: 'El tipo de documento debe ser mayor a 0' })
  type_document_id: number;

  @ApiProperty({
    description: 'Prefijo de la resolución',
    example: 'SETP',
    maxLength: 4,
  })
  @IsString({ message: 'El prefijo debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El prefijo es requerido' })
  prefix: string;

  @ApiProperty({
    description: 'Número de resolución',
    example: '18760000001',
  })
  @IsString({ message: 'La resolución debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La resolución es requerida' })
  resolution: string;

  @ApiProperty({
    description: 'Fecha de inicio de la resolución',
    example: '2024-01-15',
  })
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida' })
  @IsOptional({ message: 'La fecha de inicio es opcional' })
  date_from?: string;

  @ApiProperty({
    description: 'Fecha de fin de la resolución',
    example: '2024-01-15',
  })
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida' })
  @IsOptional({ message: 'La fecha de fin es opcional' })
  date_to?: string;

  @ApiProperty({
    description: 'Número de inicio de la resolución',
    example: 1,
  })
  @IsNumber({}, { message: 'El número de inicio debe ser un número' })
  @IsOptional({ message: 'El número de inicio es opcional' })
  @Min(1, { message: 'El número de inicio debe ser mayor a 0' })
  number_from?: number;

  @ApiProperty({
    description: 'Número de fin de la resolución',
    example: 1,
  })
  @IsNumber({}, { message: 'El número de fin debe ser un número' })
  @IsOptional({ message: 'El número de fin es opcional' })
  @Min(1, { message: 'El número de fin debe ser mayor a 0' })
  number_to?: number;

  @ApiProperty({
    description: 'Bearer token para autenticación con el servicio externo',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    minLength: 1,
  })
  @IsString({ message: 'El bearer token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El bearer token es requerido' })
  bearerToken: string;

  @ApiProperty({
    description: 'ID de la empresa',
    example: 1,
  })
  @IsNumber({}, { message: 'El ID de la empresa debe ser un número' })
  @IsNotEmpty({ message: 'El ID de la empresa es requerido' })
  @Min(1, { message: 'El ID de la empresa debe ser mayor a 0' })
  company_id: number;
} 