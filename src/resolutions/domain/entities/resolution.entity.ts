import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Company } from '@/company/domain/entities/company.entity';
import { TypeDocument } from '@/catalog/domain/entities/type-document.entity';

@Entity('resolutions')
export class Resolution {
  @ApiProperty({
    description: 'ID único de la resolución',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'ID de la empresa asociada',
    example: 1,
  })
  @Column({ name: 'company_id', type: 'bigint' })
  companyId: number;

  @ApiProperty({
    description: 'ID del tipo de documento',
    example: 1,
  })
  @Column({ name: 'type_document_id', type: 'bigint' })
  typeDocumentId: number;

  @ApiPropertyOptional({
    description: 'Prefijo de la resolución',
    example: 'PREF',
  })
  @Column({ name: 'prefix', type: 'char', length: 4, nullable: true })
  prefix: string;

  @ApiPropertyOptional({
    description: 'Número de resolución',
    example: '18760000001',
  })
  @Column({ name: 'resolution', type: 'varchar', nullable: true })
  resolution: string;

  @ApiPropertyOptional({
    description: 'Fecha de la resolución',
    example: '2024-01-15',
  })
  @Column({ name: 'resolution_date', type: 'date', nullable: true })
  resolutionDate: Date;

  @ApiPropertyOptional({
    description: 'Clave técnica de la resolución',
    example: 'abc123def456',
  })
  @Column({ name: 'technical_key', type: 'varchar', nullable: true })
  technicalKey: string;

  @ApiProperty({
    description: 'Número inicial del rango autorizado',
    example: 1,
  })
  @Column({ name: 'from', type: 'bigint' })
  from: number;

  @ApiProperty({
    description: 'Número final del rango autorizado',
    example: 5000,
  })
  @Column({ name: 'to', type: 'bigint' })
  to: number;

  @ApiPropertyOptional({
    description: 'Fecha inicial de vigencia',
    example: '2024-01-01',
  })
  @Column({ name: 'date_from', type: 'date', nullable: true })
  dateFrom: Date;

  @ApiPropertyOptional({
    description: 'Fecha final de vigencia',
    example: '2024-12-31',
  })
  @Column({ name: 'date_to', type: 'date', nullable: true })
  dateTo: Date;

  @ApiProperty({
    description: 'Empresa asociada a la resolución',
    type: () => Company,
  })
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ApiProperty({
    description: 'Tipo de documento asociado',
    type: () => TypeDocument,
  })
  @ManyToOne(() => TypeDocument)
  @JoinColumn({ name: 'type_document_id' })
  typeDocument: TypeDocument;

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