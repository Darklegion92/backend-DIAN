import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('administrators')
export class Administrator {
  @ApiProperty({
    description: 'ID único del administrador',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Número de identificación del administrador',
    example: '123456789',
  })
  @Column({ name: 'identification_number', type: 'varchar', unique: true })
  identificationNumber: string;

  @ApiPropertyOptional({
    description: 'Dígito de verificación',
    example: '9',
  })
  @Column({ name: 'dv', type: 'char', length: 1, nullable: true })
  dv: string;

  @ApiProperty({
    description: 'Nombre completo del administrador',
    example: 'Juan Pérez',
  })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiPropertyOptional({
    description: 'Dirección del administrador',
    example: 'Calle 123 #45-67',
  })
  @Column({ name: 'address', type: 'varchar', nullable: true })
  address: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+57 300 123 4567',
  })
  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone: string;

  @ApiProperty({
    description: 'Correo electrónico del administrador',
    example: 'admin@example.com',
  })
  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @ApiPropertyOptional({
    description: 'Nombre del contacto',
    example: 'María García',
  })
  @Column({ name: 'contact_name', type: 'varchar', nullable: true })
  contactName: string;

  @ApiPropertyOptional({
    description: 'Contraseña del administrador',
  })
  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string;

  @ApiPropertyOptional({
    description: 'Plan asignado al administrador',
    example: 'premium',
  })
  @Column({ name: 'plan', type: 'varchar', nullable: true })
  plan: string;

  @ApiProperty({
    description: 'Estado activo/inactivo del administrador',
    example: true,
  })
  @Column({ name: 'state', type: 'boolean', default: true })
  state: boolean;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales',
    example: 'Administrador principal del sistema',
  })
  @Column({ name: 'observation', type: 'varchar', nullable: true })
  observation: string;

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