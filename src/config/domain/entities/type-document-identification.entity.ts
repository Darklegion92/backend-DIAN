import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('type_document_identifications')
export class TypeDocumentIdentification {
  @ApiProperty({
    description: 'ID único del tipo de documento de identificación',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Nombre del tipo de documento de identificación',
    example: 'Cédula de Ciudadanía',
  })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'Código del tipo de documento de identificación',
    example: '13',
  })
  @Column({ name: 'code', type: 'varchar' })
  code: string;

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