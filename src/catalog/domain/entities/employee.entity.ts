import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('employees')
export class Employee {
  @ApiProperty({
    description: 'Número de identificación del empleado (Clave primaria)',
    example: '123456789',
  })
  @PrimaryColumn({ name: 'identification_number', type: 'varchar', length: 15 })
  identificationNumber: string;

  @ApiPropertyOptional({
    description: 'Primer nombre del empleado',
    example: 'Juan',
  })
  @Column({ name: 'first_name', type: 'varchar', length: 120, nullable: true })
  firstName: string;

  @ApiPropertyOptional({
    description: 'Segundo nombre del empleado',
    example: 'Carlos',
  })
  @Column({ name: 'middle_name', type: 'varchar', length: 120, nullable: true })
  middleName: string;

  @ApiPropertyOptional({
    description: 'Primer apellido del empleado',
    example: 'Pérez',
  })
  @Column({ name: 'surname', type: 'varchar', length: 120, nullable: true })
  surname: string;

  @ApiPropertyOptional({
    description: 'Segundo apellido del empleado',
    example: 'García',
  })
  @Column({
    name: 'second_surname',
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  secondSurname: string;

  @ApiPropertyOptional({
    description: 'Dirección de residencia del empleado',
    example: 'Calle 123 #45-67',
  })
  @Column({ name: 'address', type: 'varchar', length: 120, nullable: true })
  address: string;

  @ApiPropertyOptional({
    description: 'Correo electrónico del empleado',
    example: 'juan.perez@empresa.com',
  })
  @Column({ name: 'email', type: 'varchar', length: 120, nullable: true })
  email: string;

  @ApiPropertyOptional({
    description: 'Contraseña del empleado',
  })
  @Column({ name: 'password', type: 'varchar', length: 191, nullable: true })
  password: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña temporal del empleado',
  })
  @Column({ name: 'newpassword', type: 'varchar', length: 191, nullable: true })
  newPassword: string;

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