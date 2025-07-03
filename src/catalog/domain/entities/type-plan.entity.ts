import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';

@Entity('type_plans')
export class TypePlan {
  @PrimaryColumn({ name: 'id', type: 'bigint' })
  id: number;

  @Column({ name: 'name', type: 'varchar', unique: true })
  name: string;

  @Column({ name: 'qty_docs_invoice', type: 'bigint', default: 0 })
  qtyDocsInvoice: number;

  @Column({ name: 'qty_docs_payroll', type: 'bigint', default: 0 })
  qtyDocsPayroll: number;

  @Column({ name: 'period', type: 'bigint', default: 0 })
  period: number;

  @Column({ name: 'state', type: 'boolean', default: true })
  state: boolean;

  @Column({ name: 'observations', type: 'varchar', nullable: true })
  observations: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 