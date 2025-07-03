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
import { User } from '@/auth/domain/entities/user.entity';
import { UserDian } from '@/auth/domain/entities/userDian.entity';

@Entity('companies')
export class Company {
  @ApiProperty({
    description: 'ID único de la empresa',
    example: 1,
  })
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @ApiProperty({
    description: 'ID del usuario DIAN asociado',
    example: 1,
  })
  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @ManyToOne(() => UserDian)
  @JoinColumn({ name: 'user_id' })
  user: UserDian;

  @ApiProperty({
    description: 'Número de identificación de la empresa',
    example: '900123456',
  })
  @Column({ name: 'identification_number', type: 'varchar', length: 191, unique: true })
  identificationNumber: string;

  @ApiPropertyOptional({
    description: 'Dígito de verificación',
    example: '7',
  })
  @Column({ name: 'dv', type: 'char', length: 1, nullable: true })
  dv: string;

  @ApiProperty({
    description: 'ID del idioma',
    example: 79,
  })
  @Column({ name: 'language_id', type: 'bigint', unsigned: true })
  languageId: number;

  @ApiProperty({
    description: 'ID del impuesto',
    example: 1,
  })
  @Column({ name: 'tax_id', type: 'bigint', unsigned: true })
  taxId: number;

  @ApiProperty({
    description: 'ID del tipo de ambiente',
    example: 1,
  })
  @Column({ name: 'type_environment_id', type: 'bigint', unsigned: true })
  typeEnvironmentId: number;

  @ApiProperty({
    description: 'ID del tipo de ambiente de nómina',
    example: 1,
  })
  @Column({ name: 'payroll_type_environment_id', type: 'bigint', unsigned: true })
  payrollTypeEnvironmentId: number;

  @ApiProperty({
    description: 'ID del tipo de ambiente SD',
    example: 1,
  })
  @Column({ name: 'eqdocs_type_environment_id', type: 'bigint', unsigned: true })
  eqdocsTypeEnvironmentId: number;

  @ApiProperty({
    description: 'ID del tipo de operación',
    example: 2,
  })
  @Column({ name: 'type_operation_id', type: 'bigint', unsigned: true })
  typeOperationId: number;

  @ApiProperty({
    description: 'ID del tipo de documento de identificación',
    example: 6,
  })
  @Column({ name: 'type_document_identification_id', type: 'bigint', unsigned: true })
  typeDocumentIdentificationId: number;

  @ApiProperty({
    description: 'ID del país',
    example: 48,
  })
  @Column({ name: 'country_id', type: 'bigint', unsigned: true })
  countryId: number;

  @ApiProperty({
    description: 'ID del tipo de moneda',
    example: 35,
  })
  @Column({ name: 'type_currency_id', type: 'bigint', unsigned: true })
  typeCurrencyId: number;

  @ApiProperty({
    description: 'ID del tipo de organización',
    example: 2,
  })
  @Column({ name: 'type_organization_id', type: 'bigint', unsigned: true })
  typeOrganizationId: number;

  @ApiProperty({
    description: 'ID del tipo de régimen',
    example: 2,
  })
  @Column({ name: 'type_regime_id', type: 'bigint', unsigned: true })
  typeRegimeId: number;

  @ApiProperty({
    description: 'ID del tipo de responsabilidad',
    example: 14,
  })
  @Column({ name: 'type_liability_id', type: 'bigint', unsigned: true })
  typeLiabilityId: number;

  @ApiProperty({
    description: 'ID del municipio',
    example: 149,
  })
  @Column({ name: 'municipality_id', type: 'bigint', unsigned: true })
  municipalityId: number;

  @ApiProperty({
    description: 'Matrícula mercantil',
    example: '12345678',
  })
  @Column({ name: 'merchant_registration', type: 'varchar', length: 191 })
  merchantRegistration: string;

  @ApiProperty({
    description: 'Dirección de la empresa',
    example: 'Calle 123 #45-67',
  })
  @Column({ name: 'address', type: 'varchar', length: 191 })
  address: string;

  @ApiProperty({
    description: 'Teléfono de la empresa',
    example: '+57 300 123 4567',
  })
  @Column({ name: 'phone', type: 'varchar', length: 191 })
  phone: string;

  @ApiPropertyOptional({
    description: 'Contraseña de la empresa',
  })
  @Column({ name: 'password', type: 'varchar', length: 191, nullable: true })
  password: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña de la empresa',
  })
  @Column({ name: 'newpassword', type: 'varchar', length: 191, nullable: true })
  newPassword: string;

  @ApiProperty({
    description: 'ID del tipo de plan',
    example: 1,
  })
  @Column({ name: 'type_plan_id', type: 'bigint', unsigned: true })
  typePlanId: number;

  @ApiProperty({
    description: 'ID del tipo de plan 2',
    example: 1,
  })
  @Column({ name: 'type_plan2_id', type: 'bigint', unsigned: true })
  typePlan2Id: number;

  @ApiProperty({
    description: 'ID del tipo de plan 3',
    example: 1,
  })
  @Column({ name: 'type_plan3_id', type: 'bigint', unsigned: true })
  typePlan3Id: number;

  @ApiProperty({
    description: 'ID del tipo de plan 4',
    example: 1,
  })
  @Column({ name: 'type_plan4_id', type: 'bigint', unsigned: true })
  typePlan4Id: number;

  @ApiPropertyOptional({
    description: 'Documentos absolutos del plan',
    example: 0,
  })
  @Column({ name: 'absolut_plan_documents', type: 'bigint', nullable: true, default: 0 })
  absolutPlanDocuments: number;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del plan',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ name: 'start_plan_date', type: 'datetime', nullable: true })
  startPlanDate: Date;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del plan 2',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ name: 'start_plan_date2', type: 'datetime', nullable: true })
  startPlanDate2: Date;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del plan 3',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ name: 'start_plan_date3', type: 'datetime', nullable: true })
  startPlanDate3: Date;

  @ApiPropertyOptional({
    description: 'Fecha de inicio del plan 4',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ name: 'start_plan_date4', type: 'datetime', nullable: true })
  startPlanDate4: Date;

  @ApiPropertyOptional({
    description: 'Fecha de inicio absoluto del plan',
    example: '2024-01-15T10:30:00Z',
  })
  @Column({ name: 'absolut_start_plan_date', type: 'datetime', nullable: true })
  absolutStartPlanDate: Date;

  @ApiProperty({
    description: 'Estado activo/inactivo de la empresa',
    example: true,
  })
  @Column({ name: 'state', type: 'tinyint', width: 1, default: 1 })
  state: boolean;

  @ApiPropertyOptional({
    description: 'Host del servidor de correo',
    example: 'smtp.gmail.com',
  })
  @Column({ name: 'imap_server', type: 'varchar', length: 191, nullable: true })
  imapServer: string;

  @ApiPropertyOptional({
    description: 'Usuario del servidor de correo',
    example: 'empresa@gmail.com',
  })
  @Column({ name: 'imap_user', type: 'varchar', length: 191, nullable: true })
  imapUser: string;

  @ApiPropertyOptional({
    description: 'Contraseña del servidor de correo',
  })
  @Column({ name: 'imap_password', type: 'varchar', length: 191, nullable: true })
  imapPassword: string;

  @ApiPropertyOptional({
    description: 'Puerto del servidor de correo',
    example: '587',
  })
  @Column({ name: 'imap_port', type: 'varchar', length: 191, nullable: true })
  imapPort: string;

  @ApiPropertyOptional({
    description: 'Tipo de encriptación del correo',
    example: 'tls',
  })
  @Column({ name: 'imap_encryption', type: 'varchar', length: 191, nullable: true })
  imapEncryption: string;

  @ApiProperty({
    description: 'Permitir login de vendedores',
    example: false,
  })
  @Column({ name: 'allow_seller_login', type: 'tinyint', width: 1, default: 0 })
  allowSellerLogin: boolean;

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-15T10:30:00Z',
  })
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'ID del usuario Soltec asignado a la empresa',
    example: 'uuid-string-here',
  })
  @Column({ name: 'soltec_user_id', type: 'varchar', length: 50, nullable: true })
  soltecUserId: string;

  @ApiPropertyOptional({
    description: 'Usuario Soltec responsable de la empresa',
    type: () => User,
  })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'soltec_user_id' })
  soltecUser: User;
} 