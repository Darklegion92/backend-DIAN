import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TypeDocument } from './type-document.entity';

@Entity('document_payrolls')
export class DocumentPayroll {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'identification_number', type: 'bigint', nullable: true })
  identificationNumber: number;

  @Column({ name: 'state_document_id', type: 'int', default: 1 })
  stateDocumentId: number;

  @Column({ name: 'type_document_id', type: 'bigint' })
  typeDocumentId: number;

  @Column({ name: 'prefix', type: 'char', nullable: true })
  prefix: string;

  @Column({ name: 'consecutive', type: 'varchar' })
  consecutive: string;

  @Column({ name: 'xml', type: 'varchar', nullable: true })
  xml: string;

  @Column({ name: 'pdf', type: 'varchar', nullable: true })
  pdf: string;

  @Column({ name: 'cune', type: 'varchar', nullable: true })
  cune: string;

  @Column({ name: 'employee_id', type: 'varchar', nullable: true })
  employeeId: string;

  @Column({ name: 'date_issue', type: 'datetime' })
  dateIssue: Date;

  @Column({ name: 'accrued_total', type: 'decimal', precision: 18, scale: 2 })
  accruedTotal: number;

  @Column({ name: 'deductions_total', type: 'decimal', precision: 18, scale: 2 })
  deductionsTotal: number;

  @Column({ name: 'total_payroll', type: 'decimal', precision: 18, scale: 2 })
  totalPayroll: number;

  @Column({ name: 'request_api', type: 'json', nullable: true })
  requestApi: object;

  @ManyToOne(() => TypeDocument)
  @JoinColumn({ name: 'type_document_id' })
  typeDocument: TypeDocument;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 