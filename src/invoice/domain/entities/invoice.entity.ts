import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}



@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'number', type: 'varchar', length: 50 })
  number: string;

  @Column({ name: 'prefix', type: 'varchar', length: 10, nullable: true })
  prefix?: string;

  @Column({ name: 'company_nit', type: 'varchar', length: 20 })
  companyNit: string;

  @Column({ name: 'customer_nit', type: 'varchar', length: 20 })
  customerNit: string;

  @Column({ name: 'customer_name', type: 'varchar', length: 255 })
  customerName: string;

  @Column({ name: 'issue_date', type: 'datetime' })
  issueDate: Date;

  @Column({ name: 'due_date', type: 'datetime', nullable: true })
  dueDate?: Date;

  @Column({ name: 'cufe', type: 'varchar', length: 96 })
  cufe: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 15, scale: 2 })
  taxAmount: number;

  @Column({ name: 'status', type: 'varchar', length: 20, default: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes?: string;

  @OneToMany(() => InvoiceLine, line => line.invoice, { cascade: true })
  lines: InvoiceLine[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

@Entity('invoice_lines')
export class InvoiceLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'invoice_id', type: 'uuid' })
  invoiceId: string;

  @Column({ name: 'description', type: 'varchar', length: 500 })
  description: string;

  @Column({ name: 'quantity', type: 'decimal', precision: 10, scale: 3 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 2 })
  unitPrice: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2 })
  taxRate: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 15, scale: 2 })
  totalAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relación con Invoice
  invoice: Invoice;
}

 