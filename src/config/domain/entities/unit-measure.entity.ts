import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('unit_measures')
export class UnitMeasure {
  @ApiProperty({
    description: 'ID único de la unidad de medida',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Nombre de la unidad de medida',
    example: 'Unidad',
  })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'Código de la unidad de medida',
    example: '94',
  })
  @Column({ name: 'code', type: 'varchar' })
  code: string;

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