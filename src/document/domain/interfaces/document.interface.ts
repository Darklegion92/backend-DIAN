import { ApiProperty } from '@nestjs/swagger';

export class SendDocumentElectronicRequest {
  @ApiProperty({
    description: 'Token de autenticación DIAN',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: true
  })
  tokenDian: string;

  @ApiProperty({
    description: 'Cadena de cabecera',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  header: string;

  @ApiProperty({
    description: 'Cadena de detalle',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  detail: string;

  @ApiProperty({
    description: 'Cadena de impuestos',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  taxes: string;

  @ApiProperty({
    description: 'Cadena de descuentos',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  discount: string;

  @ApiProperty({
    description: 'Cadena de pago',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  payment: string;

  @ApiProperty({
    description: 'Cadena de cliente',
    example: '02J||||2025-02-28|10|1|||0||||||',
    required: true
  })
  customer: string;

  @ApiProperty({
    description: 'Número de resolución DIAN',
    example: '18764000001',
    required: true
  })
  resolutionNumber: string;

  @ApiProperty({
    description: 'NIT de la empresa',
    example: '123456789',
    required: true
  })
  nit: string;

  @ApiProperty({
    description: 'Tipo de documento (1=Factura, 2=Nota Crédito, 3=Nota Débito)',
    example: 1,
    required: true,
    type: Number
  })
  typeDocumentId: number;
}

export class DocumentData {
  @ApiProperty({
    description: 'Fecha de procesamiento',
    example: '2025-01-15T10:30:00.000Z'
  })
  date: string;

  @ApiProperty({
    description: 'CUFE del documento',
    example: '242ce5e27513a17745451897097055f930ca5c5f3f2fe9c0a11e78976ad900e577297ec7e3ca55d8b2c506068195146a'
  })
  cufe: string;

  @ApiProperty({
    description: 'Documento en formato base64',
    example: 'JVBERi0xLjcKCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDI...'
  })
  document: string;
}

export class SendDocumentElectronicResponse {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Mensaje descriptivo del resultado',
    example: 'Documento electrónico procesado correctamente'
  })
  message: string;

  @ApiProperty({
    description: 'Datos del documento procesado',
    type: DocumentData
  })
  data: DocumentData;
}

export interface SendDocumentElectronicData {
  cufe: string;
  prefix: string;
  number: string;
  date: string;
  document: string;
}