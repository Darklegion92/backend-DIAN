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

@Entity('received_documents')
export class ReceivedDocument {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'identification_number', type: 'bigint' })
  identificationNumber: number;

  @Column({ name: 'dv', type: 'char', length: 1 })
  dv: string;

  @Column({ name: 'name_seller', type: 'varchar', length: 255 })
  nameSeller: string;

  @Column({ name: 'state_document_id', type: 'int', default: 0 })
  stateDocumentId: number;

  @Column({ name: 'type_document_id', type: 'bigint' })
  typeDocumentId: number;

  @Column({ name: 'customer', type: 'varchar', length: 15 })
  customer: string;

  @Column({ name: 'prefix', type: 'char', nullable: true })
  prefix: string;

  @Column({ name: 'number', type: 'varchar' })
  number: string;

  @Column({ name: 'xml', type: 'varchar', nullable: true })
  xml: string;

  @Column({ name: 'cufe', type: 'varchar', nullable: true })
  cufe: string;

  @Column({ name: 'date_issue', type: 'datetime' })
  dateIssue: Date;

  @Column({ name: 'sale', type: 'float', precision: 10, scale: 2 })
  sale: number;

  @Column({ name: 'subtotal', type: 'float', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ name: 'total', type: 'float', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'total_discount', type: 'float', precision: 10, scale: 2 })
  totalDiscount: number;

  @Column({ name: 'total_tax', type: 'float', precision: 10, scale: 2 })
  totalTax: number;

  @Column({ name: 'ambient_id', type: 'int' })
  ambientId: number;

  @Column({ name: 'pdf', type: 'varchar', nullable: true })
  pdf: string;

  @Column({ name: 'acu_recibo', type: 'boolean', default: false })
  acuRecibo: boolean;

  @Column({ name: 'rec_bienes', type: 'boolean', default: false })
  recBienes: boolean;

  @Column({ name: 'aceptacion', type: 'boolean', default: false })
  aceptacion: boolean;

  @Column({ name: 'rechazo', type: 'boolean', default: false })
  rechazo: boolean;

  @Column({ name: 'customer_name', type: 'varchar', nullable: true })
  customerName: string;

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