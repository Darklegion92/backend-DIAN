import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../../auth/domain/entities/user.entity';

@Entity('companies')
export class Company {
  @ApiProperty({
    description: 'ID único de la empresa',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Número de identificación de la empresa',
    example: '900123456',
  })
  @Column({ name: 'identification_number', type: 'varchar', unique: true })
  identificationNumber: string;

  @ApiPropertyOptional({
    description: 'Dígito de verificación',
    example: '7',
  })
  @Column({ name: 'dv', type: 'char', length: 1, nullable: true })
  dv: string;

  @ApiProperty({
    description: 'ID del tipo de documento de identificación',
    example: 6,
  })
  @Column({ name: 'type_document_identification_id', type: 'int' })
  typeDocumentIdentificationId: number;

  @ApiProperty({
    description: 'ID del tipo de organización',
    example: 2,
  })
  @Column({ name: 'type_organization_id', type: 'int' })
  typeOrganizationId: number;

  @ApiProperty({
    description: 'ID del idioma',
    example: 79,
  })
  @Column({ name: 'language_id', type: 'int' })
  languageId: number;

  @ApiProperty({
    description: 'ID del impuesto',
    example: 1,
  })
  @Column({ name: 'tax_id', type: 'int' })
  taxId: number;

  @ApiProperty({
    description: 'ID del tipo de operación',
    example: 2,
  })
  @Column({ name: 'type_operation_id', type: 'int' })
  typeOperationId: number;

  @ApiProperty({
    description: 'ID del tipo de régimen',
    example: 2,
  })
  @Column({ name: 'type_regime_id', type: 'int' })
  typeRegimeId: number;

  @ApiProperty({
    description: 'ID del tipo de responsabilidad',
    example: 14,
  })
  @Column({ name: 'type_liability_id', type: 'int' })
  typeLiabilityId: number;

  @ApiProperty({
    description: 'ID del municipio',
    example: 149,
  })
  @Column({ name: 'municipality_id', type: 'int' })
  municipalityId: number;

  @ApiProperty({
    description: 'ID del tipo de ambiente',
    example: 1,
  })
  @Column({ name: 'type_environment_id', type: 'int' })
  typeEnvironmentId: number;

  @ApiPropertyOptional({
    description: 'ID del tipo de ambiente de nómina',
    example: 1,
  })
  @Column({ name: 'payroll_type_environment_id', type: 'int', nullable: true })
  payrollTypeEnvironmentId: number;

  @ApiPropertyOptional({
    description: 'ID del tipo de ambiente SD',
    example: 1,
  })
  @Column({ name: 'eqdocs_type_environment_id', type: 'int', nullable: true })
  eqdocsTypeEnvironmentId: number;

  @ApiProperty({
    description: 'Dirección de la empresa',
    example: 'Carrera 123 #45-67',
  })
  @Column({ name: 'address', type: 'varchar' })
  address: string;

  @ApiProperty({
    description: 'Número de teléfono de la empresa',
    example: '+57 1 123 4567',
  })
  @Column({ name: 'phone', type: 'varchar' })
  phone: string;

  @ApiProperty({
    description: 'Matrícula mercantil',
    example: '12345678',
  })
  @Column({ name: 'merchant_registration', type: 'varchar' })
  merchantRegistration: string;

  @ApiProperty({
    description: 'Estado activo/inactivo de la empresa',
    example: true,
  })
  @Column({ name: 'state', type: 'boolean', default: true })
  state: boolean;

  @ApiPropertyOptional({
    description: 'Contraseña de la empresa',
  })
  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string;

  @ApiProperty({
    description: 'Permitir login de vendedores',
    example: false,
  })
  @Column({ name: 'allow_seller_login', type: 'boolean', default: false })
  allowSellerLogin: boolean;

  @ApiPropertyOptional({
    description: 'Host del servidor de correo',
    example: 'smtp.gmail.com',
  })
  @Column({ name: 'imap_server', type: 'varchar', nullable: true })
  imapServer: string;

  @ApiPropertyOptional({
    description: 'Puerto del servidor de correo',
    example: '587',
  })
  @Column({ name: 'imap_port', type: 'varchar', nullable: true })
  imapPort: string;

  @ApiPropertyOptional({
    description: 'Usuario del servidor de correo',
    example: 'empresa@gmail.com',
  })
  @Column({ name: 'imap_user', type: 'varchar', nullable: true })
  imapUser: string;

  @ApiPropertyOptional({
    description: 'Contraseña del servidor de correo',
  })
  @Column({ name: 'imap_password', type: 'varchar', nullable: true })
  imapPassword: string;

  @ApiPropertyOptional({
    description: 'Tipo de encriptación del correo',
    example: 'tls',
  })
  @Column({ name: 'imap_encryption', type: 'varchar', nullable: true })
  imapEncryption: string;

  @ApiPropertyOptional({
    description: 'ID del usuario Soltec asignado a la empresa',
    example: 'uuid-string-here',
  })
  @Column({ name: 'soltec_user_id', type: 'uuid', nullable: true })
  soltecUserId: string;

  @ApiPropertyOptional({
    description: 'Usuario Soltec responsable de la empresa',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'soltec_user_id' })
  soltecUser: User;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del registro',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 