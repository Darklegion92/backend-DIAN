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
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Nombre del tipo de documento',
    example: 'Factura de Venta',
  })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

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