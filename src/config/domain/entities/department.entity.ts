import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'country_id', type: 'bigint' })
  countryId: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'code', type: 'char' })
  code: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 