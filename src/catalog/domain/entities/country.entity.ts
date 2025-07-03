import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('countries')
export class Country {
  @ApiProperty({
    description: 'ID único del país',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Nombre del país',
    example: 'Colombia',
  })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción adicional del país',
    example: 'República de Colombia',
  })
  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Estado activo/inactivo del país',
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