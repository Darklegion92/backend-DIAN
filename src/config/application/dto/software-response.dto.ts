import { ApiProperty } from '@nestjs/swagger';

export class SoftwareDataDto {
  @ApiProperty({ description: 'ID único del software', example: 1 })
  id: number;

  @ApiProperty({ 
    description: 'Identificador del software', 
    example: 'f46f2b97-dfce-4b0d-a0cb-2ebd67c72e6d' 
  })
  identifier: string;

  @ApiProperty({ description: 'PIN del software', example: '25656' })
  pin: string;

  @ApiProperty({ description: 'Identificador de nómina', example: '' })
  identifier_payroll: string;

  @ApiProperty({ description: 'PIN de nómina', example: '' })
  pin_payroll: string;

  @ApiProperty({ description: 'Identificador de documentos equivalentes', example: '' })
  identifier_eqdocs: string;

  @ApiProperty({ description: 'PIN de documentos equivalentes', example: '' })
  pin_eqdocs: string;

  @ApiProperty({ 
    description: 'URL del servicio', 
    example: 'https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc' 
  })
  url: string;

  @ApiProperty({ 
    description: 'URL del servicio de nómina', 
    example: 'https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc' 
  })
  url_payroll: string;

  @ApiProperty({ 
    description: 'URL del servicio de documentos equivalentes', 
    example: 'https://vpfe-hab.dian.gov.co/WcfDianCustomerServices.svc' 
  })
  url_eqdocs: string;

  @ApiProperty({ description: 'Fecha de creación', example: '2025-06-01 20:29:43' })
  created_at: string;

  @ApiProperty({ description: 'Fecha de actualización', example: '2025-06-01 20:29:43' })
  updated_at: string;
}

export class SoftwareResponseDto {
  @ApiProperty({ description: 'Indica si la operación fue exitosa', example: true })
  success: boolean;

  @ApiProperty({ 
    description: 'Mensaje descriptivo de la operación', 
    example: 'Software creado/actualizado con éxito' 
  })
  message: string;

  @ApiProperty({ description: 'Datos del software creado/actualizado' })
  software: SoftwareDataDto;
} 