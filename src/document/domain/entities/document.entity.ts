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

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'identification_number', type: 'bigint' })
  identificationNumber: number;

  @Column({ name: 'dv', type: 'char', length: 1 })
  dv: string;

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

  @Column({ name: 'notes', type: 'varchar', nullable: true })
  notes: string;

  @Column({ name: 'head_note', type: 'varchar', nullable: true })
  headNote: string;

  @Column({ name: 'foot_note', type: 'varchar', nullable: true })
  footNote: string;

  @Column({ name: 'xml', type: 'varchar', nullable: true })
  xml: string;

  @Column({ name: 'cufe', type: 'varchar', nullable: true })
  cufe: string;

  @Column({ name: 'cude', type: 'varchar', nullable: true })
  cude: string;

  @Column({ name: 'algorithm', type: 'varchar', nullable: true })
  algorithm: string;

  @Column({ name: 'qr', type: 'varchar', nullable: true })
  qr: string;

  @Column({ name: 'date_issue', type: 'datetime' })
  dateIssue: Date;

  @Column({ name: 'time_issue', type: 'time' })
  timeIssue: string;

  @Column({ name: 'date_expiration', type: 'datetime', nullable: true })
  dateExpiration: Date;

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

  @Column({ name: 'send_dian', type: 'boolean', default: false })
  sendDian: boolean;

  @Column({ name: 'pdf', type: 'varchar', nullable: true })
  pdf: string;

  @Column({ name: 'event_id', type: 'int', nullable: true })
  eventId: number;

  @Column({ name: 'event_update_status', type: 'varchar', nullable: true })
  eventUpdateStatus: string;

  @Column({ name: 'send_email_date_time', type: 'datetime', nullable: true })
  sendEmailDateTime: Date;

  @Column({ name: 'send_email_success', type: 'boolean', default: false })
  sendEmailSuccess: boolean;

  @Column({ name: 'response_dian', type: 'text', nullable: true })
  responseDian: string;

  @Column({ name: 'response_api', type: 'text', nullable: true })
  responseApi: string;

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