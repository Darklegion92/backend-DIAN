import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('type_currencies')
export class TypeCurrency {
  @ApiProperty({
    description: 'ID único del tipo de moneda',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Nombre del tipo de moneda',
    example: 'Peso Colombiano',
  })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'Código del tipo de moneda',
    example: 'COP',
  })
  @Column({ name: 'code', type: 'varchar' })
  code: string;

  @ApiProperty({
    description: 'Estado activo/inactivo del tipo de moneda',
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