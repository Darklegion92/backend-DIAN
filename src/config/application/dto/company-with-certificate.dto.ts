import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyWithCertificateDto {
  @ApiProperty({
    description: 'ID único de la empresa',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Número de identificación de la empresa',
    example: '900123456',
  })
  identificationNumber: string;

  @ApiPropertyOptional({
    description: 'Dígito de verificación',
    example: '7',
  })
  dv: string;

  @ApiProperty({
    description: 'ID del tipo de documento de identificación',
    example: 6,
  })
  typeDocumentIdentificationId: number;

  @ApiProperty({
    description: 'ID del tipo de organización',
    example: 2,
  })
  typeOrganizationId: number;

  @ApiProperty({
    description: 'ID del idioma',
    example: 79,
  })
  languageId: number;

  @ApiProperty({
    description: 'ID del impuesto',
    example: 1,
  })
  taxId: number;

  @ApiProperty({
    description: 'ID del tipo de operación',
    example: 2,
  })
  typeOperationId: number;

  @ApiProperty({
    description: 'ID del tipo de régimen',
    example: 2,
  })
  typeRegimeId: number;

  @ApiProperty({
    description: 'ID del tipo de responsabilidad',
    example: 14,
  })
  typeLiabilityId: number;

  @ApiProperty({
    description: 'ID del municipio',
    example: 149,
  })
  municipalityId: number;

  @ApiProperty({
    description: 'ID del tipo de ambiente',
    example: 1,
  })
  typeEnvironmentId: number;

  @ApiPropertyOptional({
    description: 'ID del tipo de ambiente de nómina',
    example: 1,
  })
  payrollTypeEnvironmentId: number;

  @ApiPropertyOptional({
    description: 'ID del tipo de ambiente SD',
    example: 1,
  })
  sdTypeEnvironmentId: number;

  @ApiProperty({
    description: 'Razón social de la empresa',
    example: 'EMPRESA ABC S.A.S.',
  })
  name: string;

  @ApiProperty({
    description: 'Dirección de la empresa',
    example: 'Carrera 123 #45-67',
  })
  address: string;

  @ApiProperty({
    description: 'Número de teléfono de la empresa',
    example: '+57 1 123 4567',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Sitio web de la empresa',
    example: 'https://www.empresa.com',
  })
  web: string;

  @ApiProperty({
    description: 'Correo electrónico de la empresa',
    example: 'info@empresa.com',
  })
  email: string;

  @ApiProperty({
    description: 'Matrícula mercantil',
    example: '12345678',
  })
  merchantRegistration: string;

  @ApiProperty({
    description: 'Estado activo/inactivo de la empresa',
    example: true,
  })
  state: boolean;

  @ApiProperty({
    description: 'Plan de documentos',
    example: 1000,
  })
  planDocuments: number;

  @ApiProperty({
    description: 'Plan de documentos RADIAN',
    example: 500,
  })
  planRadianDocuments: number;

  @ApiProperty({
    description: 'Plan de documentos de nómina',
    example: 200,
  })
  planPayrollDocuments: number;

  @ApiProperty({
    description: 'Plan de documentos DS',
    example: 100,
  })
  planDsDocuments: number;

  @ApiProperty({
    description: 'Período del plan (0-Default, 1-Mensual, 2-Anual, 3-Paquete)',
    example: 1,
  })
  planPeriod: number;

  @ApiProperty({
    description: 'Documentos enviados',
    example: 150,
  })
  documentsSent: number;

  @ApiProperty({
    description: 'Documentos RADIAN enviados',
    example: 50,
  })
  radianDocumentsSent: number;

  @ApiProperty({
    description: 'Documentos de nómina enviados',
    example: 25,
  })
  payrollDocumentsSent: number;

  @ApiProperty({
    description: 'Documentos DS enviados',
    example: 10,
  })
  dsDocumentsSent: number;

  @ApiPropertyOptional({
    description: 'Fecha de expiración del plan',
    example: '2024-12-31T23:59:59Z',
  })
  planExpirationDate: Date;

  @ApiPropertyOptional({
    description: 'Contraseña de la empresa',
  })
  password: string;

  @ApiProperty({
    description: 'Permitir login de vendedores',
    example: false,
  })
  allowSellerLogin: boolean;

  @ApiPropertyOptional({
    description: 'Host del servidor de correo',
    example: 'smtp.gmail.com',
  })
  mailHost: string;

  @ApiPropertyOptional({
    description: 'Puerto del servidor de correo',
    example: '587',
  })
  mailPort: string;

  @ApiPropertyOptional({
    description: 'Usuario del servidor de correo',
    example: 'empresa@gmail.com',
  })
  mailUsername: string;

  @ApiPropertyOptional({
    description: 'Contraseña del servidor de correo',
  })
  mailPassword: string;

  @ApiPropertyOptional({
    description: 'Tipo de encriptación del correo',
    example: 'tls',
  })
  mailEncryption: string;

  @ApiPropertyOptional({
    description: 'Dirección de correo remitente',
    example: 'noreply@empresa.com',
  })
  mailFromAddress: string;

  @ApiPropertyOptional({
    description: 'Nombre del remitente',
    example: 'Empresa ABC',
  })
  mailFromName: string;

  @ApiPropertyOptional({
    description: 'ID del usuario Soltec asignado a la empresa',
    example: 'uuid-string-here',
  })
  soltecUserId: string;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Fecha de vencimiento del certificado',
    example: '2025-12-31T23:59:59Z',
  })
  certificateExpirationDate: Date;

  @ApiPropertyOptional({
    description: 'ID del certificado asociado',
    example: 1,
  })
  certificateId: number;

  @ApiPropertyOptional({
    description: 'Nombre del certificado',
    example: 'certificado_empresa.p12',
  })
  certificateName: string;
} 