import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsDateString, Min } from 'class-validator';

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
    description: 'Fecha de la resolución en formato YYYY-MM-DD',
    example: '2019-01-19',
  })
  @IsDateString({}, { message: 'La fecha de resolución debe tener formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'La fecha de resolución es requerida' })
  resolution_date: string;

  @ApiProperty({
    description: 'Número inicial del rango autorizado',
    example: 990000000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'El número inicial debe ser un número' })
  @IsNotEmpty({ message: 'El número inicial es requerido' })
  @Min(0, { message: 'El número inicial debe ser mayor o igual a 0' })
  from: number;

  @ApiProperty({
    description: 'Número final del rango autorizado',
    example: 995000000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'El número final debe ser un número' })
  @IsNotEmpty({ message: 'El número final es requerido' })
  @Min(0, { message: 'El número final debe ser mayor o igual a 0' })
  to: number;

  @ApiProperty({
    description: 'Número generado hasta la fecha',
    example: 0,
    minimum: 0,
  })
  @IsNumber({}, { message: 'El número generado debe ser un número' })
  @IsNotEmpty({ message: 'El número generado es requerido' })
  @Min(0, { message: 'El número generado debe ser mayor o igual a 0' })
  generated_to_date: number;

  @ApiProperty({
    description: 'Fecha inicial de vigencia en formato YYYY-MM-DD',
    example: '2019-01-19',
  })
  @IsDateString({}, { message: 'La fecha inicial debe tener formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'La fecha inicial es requerida' })
  date_from: string;

  @ApiProperty({
    description: 'Fecha final de vigencia en formato YYYY-MM-DD',
    example: '2030-01-19',
  })
  @IsDateString({}, { message: 'La fecha final debe tener formato YYYY-MM-DD' })
  @IsNotEmpty({ message: 'La fecha final es requerida' })
  date_to: string;

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