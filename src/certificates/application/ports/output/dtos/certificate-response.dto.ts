import { ApiProperty } from '@nestjs/swagger';

export class CertificateDataDto {
  @ApiProperty({
    description: 'ID único del certificado',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nombre del archivo del certificado',
    example: '9015846200.p12',
  })
  name: string;

  @ApiProperty({
    description: 'Contraseña del certificado',
    example: 'bFOGqscdpZQlQWkd',
  })
  password: string;

  @ApiProperty({
    description: 'Fecha de expiración del certificado',
    example: '2025/05/21 07:04:32',
  })
  expiration_date: string;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2025-06-01 20:51:35',
  })
  updated_at: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-06-01 20:51:35',
  })
  created_at: string;
}

export class CertificateResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Certificado creado con éxito',
  })
  message: string;

  @ApiProperty({
    description: 'Datos del certificado creado',
    type: CertificateDataDto,
  })
  certificado: CertificateDataDto;
} 