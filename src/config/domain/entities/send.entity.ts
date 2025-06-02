import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Company } from './company.entity';
import { TypeDocument } from '../../../document/domain/entities/type-document.entity';

@Entity('sends')
@Unique(['companyId', 'typeDocumentId', 'year'])
export class Send {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'company_id', type: 'bigint' })
  companyId: number;

  @Column({ name: 'type_document_id', type: 'bigint' })
  typeDocumentId: number;

  @Column({ name: 'year', type: 'year' })
  year: number;

  @Column({ name: 'next_consecutive', type: 'bigint', default: 1 })
  nextConsecutive: number;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => TypeDocument)
  @JoinColumn({ name: 'type_document_id' })
  typeDocument: TypeDocument;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 