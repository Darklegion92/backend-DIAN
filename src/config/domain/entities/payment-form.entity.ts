import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('payment_forms')
export class PaymentForm {
  @ApiProperty({
    description: 'ID único de la forma de pago',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Nombre de la forma de pago',
    example: 'Efectivo',
  })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'Código de la forma de pago',
    example: '10',
  })
  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @ApiProperty({
    description: 'Estado activo/inactivo de la forma de pago',
    example: true,
  })
  @Column({ name: 'state', type: 'boolean', default: true })
  state: boolean;

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