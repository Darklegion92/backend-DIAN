import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('customers')
export class Customer {
  @ApiProperty({
    description: 'Número de identificación del cliente (Clave primaria)',
    example: '123456789',
  })
  @PrimaryColumn({ name: 'identification_number', type: 'varchar', length: 15 })
  identificationNumber: string;

  @ApiPropertyOptional({
    description: 'Dígito de verificación',
    example: '9',
  })
  @Column({ name: 'dv', type: 'varchar', length: 1, nullable: true })
  dv: string;

  @ApiPropertyOptional({
    description: 'Nombre completo del cliente',
    example: 'Juan Pérez García',
  })
  @Column({ name: 'name', type: 'varchar', length: 120, nullable: true })
  name: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono del cliente',
    example: '+57 300 123 4567',
  })
  @Column({ name: 'phone', type: 'varchar', length: 30, nullable: true })
  phone: string;

  @ApiPropertyOptional({
    description: 'Dirección de residencia del cliente',
    example: 'Calle 123 #45-67',
  })
  @Column({ name: 'address', type: 'varchar', length: 120, nullable: true })
  address: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del cliente',
    example: 'cliente@email.com',
  })
  @Column({ name: 'email', type: 'varchar', length: 120, nullable: true })
  email: string;

  @ApiPropertyOptional({
    description: 'Contraseña del cliente',
  })
  @Column({ name: 'password', type: 'varchar', length: 10, nullable: true })
  password: string;

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