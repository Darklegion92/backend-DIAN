import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCertificateDto {
  @ApiProperty({
    description: 'Certificado en formato base64',
    example: 'MIACAQMwgAYJKoZIhvcNAQcBoIAkgASCA+gwgDCABgkqhkiG9...',
    minLength: 1,
  })
  @IsString({ message: 'El certificado debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El certificado es requerido' })
  @MinLength(1, { message: 'El certificado no puede estar vacío' })
  certificate: string;

  @ApiProperty({
    description: 'Contraseña del certificado',
    example: 'bFOGqscdpZQlQWkd',
    minLength: 1,
  })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(1, { message: 'La contraseña no puede estar vacía' })
  password: string;

  @ApiProperty({
    description: 'Bearer token para autenticación con el servicio externo',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    minLength: 1,
  })
  @IsString({ message: 'El bearer token debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El bearer token es requerido' })
  @MinLength(1, { message: 'El bearer token no puede estar vacío' })
  bearerToken: string;
} 