import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

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