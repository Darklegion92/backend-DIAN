import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('events')
export class Event {
  @ApiProperty({
    description: 'ID único del evento',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Nombre del evento',
    example: 'Facturación Electrónica',
  })
  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Código del evento',
    example: '030',
  })
  @Column({ name: 'code', type: 'varchar', length: 5 })
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