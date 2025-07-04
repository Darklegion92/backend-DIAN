import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSoftwareDto {
  @ApiProperty({
    description: 'Identificador único del software',
    example: 'f46f2b97-dfce-4b0d-a0cb-2ebd67c72e6d',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'PIN numérico del software',
    example: 25656,
  })
  @IsNotEmpty()
  @IsNumber()
  pin: number;

  @ApiProperty({
    description: 'Token de autorización de la empresa',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Tipo de software',
    example: 'payroll',
  })
  @IsNotEmpty()
  @IsString()
  type_software: string;
} 