import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity('type_documents')
export class TypeDocument {
  @ApiProperty({
    description: 'ID único del tipo de documento',
    example: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del tipo de documento',
    example: 'Factura de Venta',
  })
  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    description: 'Código del tipo de documento',
    example: '01',
  })
  @Column({
    type: 'varchar',
    length: 10,
    nullable: false,
  })
  code: string;

  @ApiPropertyOptional({
    description: 'CUDS del tipo de documento',
    example: 'abc123def456',
  })
  @Column({ name: 'cuds', type: 'varchar', nullable: true })
  cuds: string;

  @ApiPropertyOptional({
    description: 'Algoritmo utilizado',
    example: 'XMLDSIG',
  })
  @Column({ name: 'algorithm', type: 'varchar', nullable: true })
  algorithm: string;

  @ApiProperty({
    description: 'Estado activo/inactivo del tipo de documento',
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