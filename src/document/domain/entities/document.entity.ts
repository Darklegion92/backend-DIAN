import { TypeDocument } from '@/catalog/domain/entities/type-document.entity';
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

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'identification_number', type: 'varchar', length: 25, nullable: true })
  identificationNumber: string;

  @Column({ name: 'state_document_id', type: 'int', unsigned: true, default: 1 })
  stateDocumentId: number;

  @Column({ name: 'type_document_id', type: 'bigint', unsigned: true })
  typeDocumentId: number;

  @Column({ name: 'customer', type: 'varchar', length: 15 })
  customer: string;

  @Column({ name: 'prefix', type: 'char', length: 191, nullable: true })
  prefix: string;

  @Column({ name: 'number', type: 'varchar', length: 191 })
  number: string;

  @Column({ name: 'xml', type: 'varchar', length: 191, nullable: true })
  xml: string;

  @Column({ name: 'cufe', type: 'varchar', length: 191, nullable: true })
  cufe: string;

  @Column({ name: 'type_invoice_id', type: 'int', unsigned: true, nullable: true })
  typeInvoiceId: number;

  @Column({ name: 'client_id', type: 'varchar', length: 25 })
  clientId: string;

  @Column({ name: 'client', type: 'json' })
  client: any;

  @Column({ name: 'currency_id', type: 'int', unsigned: true })
  currencyId: number;

  @Column({ name: 'date_issue', type: 'datetime' })
  dateIssue: Date;

  @Column({ name: 'reference_id', type: 'int', unsigned: true, nullable: true })
  referenceId: number;

  @Column({ name: 'note_concept_id', type: 'int', unsigned: true, nullable: true })
  noteConceptId: number;

  @Column({ name: 'sale', type: 'double' })
  sale: number;

  @Column({ name: 'total_discount', type: 'double' })
  totalDiscount: number;

  @Column({ name: 'taxes', type: 'json', nullable: true })
  taxes: any;

  @Column({ name: 'total_tax', type: 'double' })
  totalTax: number;

  @Column({ name: 'subtotal', type: 'double' })
  subtotal: number;

  @Column({ name: 'total', type: 'double' })
  total: number;

  @Column({ name: 'version_ubl_id', type: 'int', unsigned: true })
  versionUblId: number;

  @Column({ name: 'ambient_id', type: 'int', unsigned: true })
  ambientId: number;

  @Column({ name: 'request_api', type: 'json', nullable: true })
  requestApi: any;

  @Column({ name: 'response_api', type: 'json', nullable: true })
  responseApi: any;

  @Column({ name: 'response_dian', type: 'json', nullable: true })
  responseDian: any;

  @Column({ name: 'pdf', type: 'varchar', length: 191, nullable: true })
  pdf: string;

  @Column({ name: 'aceptacion', type: 'tinyint', width: 1, default: 0 })
  aceptacion: boolean;

  @Column({ name: 'send_email_success', type: 'tinyint', width: 1, default: 0 })
  sendEmailSuccess: boolean;

  @Column({ name: 'send_email_date_time', type: 'datetime', nullable: true })
  sendEmailDateTime: Date;

  @Column({ name: 'cude_aceptacion', type: 'varchar', length: 191, nullable: true })
  cudeAceptacion: string;

  @Column({ name: 'payload_aceptacion', type: 'json', nullable: true })
  payloadAceptacion: any;

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