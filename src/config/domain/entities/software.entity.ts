import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('software')
export class Software {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'company_id', type: 'bigint' })
  companyId: number;

  @Column({ name: 'identifier', type: 'varchar' })
  identifier: string;

  @Column({ name: 'pin', type: 'varchar' })
  pin: string;

  @Column({ name: 'url', type: 'varchar' })
  url: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 