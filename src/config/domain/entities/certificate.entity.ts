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
import { Company } from './company.entity';

@Entity('certificates')
export class Certificate {
  @ApiProperty({
    description: 'ID único del certificado',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'ID de la empresa asociada al certificado',
    example: 1,
  })
  @Column({ name: 'company_id', type: 'bigint' })
  companyId: number;

  @ApiProperty({
    description: 'Nombre del certificado',
    example: 'certificado_empresa.p12',
  })
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @ApiProperty({
    description: 'Contraseña del certificado',
  })
  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @ApiPropertyOptional({
    description: 'Fecha de vencimiento del certificado',
    example: '2025-12-31T23:59:59Z',
  })
  @Column({ name: 'expiration_date', type: 'datetime', nullable: true })
  expirationDate: Date;

  @ApiProperty({
    description: 'Empresa asociada al certificado',
    type: () => Company,
  })
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

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