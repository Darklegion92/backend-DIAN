import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEnvironmentDto {
  @ApiProperty({
    description: 'ID del tipo de ambiente',
    example: 2,
    type: Number,
  })
  @IsNumber({}, { message: 'type_environment_id debe ser un número' })
  @IsOptional()
  type_environment_id: number;

  @ApiProperty({
    description: 'ID del tipo de ambiente para nómina',
    example: 2,
    type: Number,
  })
  @IsNumber({}, { message: 'payroll_type_environment_id debe ser un número' })
  @IsOptional()
  payroll_type_environment_id: number;

  @ApiProperty({
    description: 'ID del tipo de ambiente para documentos EQ',
    example: 2,
    type: Number,
  })
  @IsNumber({}, { message: 'eqdocs_type_environment_id debe ser un número' })
  @IsOptional()
  eqdocs_type_environment_id: number;

  @ApiProperty({
    description: 'Token de autenticación',
    example: '1234567890',
    type: String,
  })
  @IsNotEmpty({ message: 'token es requerido' })
  token: string;
} 