import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('received_documents')
export class ReceivedDocumentEntity {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'identification_number', type: 'bigint' })
    identification_number: number;

    @Column({ type: 'char', length: 1 })
    dv: string;

    @Column({ name: 'name_seller' })
    name_seller: string;

    @Column({ name: 'state_document_id', type: 'int', unsigned: true, default: 0 })
    state_document_id: number;

    @Column({ name: 'type_document_id', type: 'bigint', unsigned: true })
    type_document_id: number;

    @Column({ length: 15 })
    customer: string;

    @Column({ name: 'customer_name', nullable: true })
    customer_name: string | null;

    @Column({ type: 'char', nullable: true })
    prefix: string | null;

    @Column()
    number: string;

    @Column({ nullable: true })
    xml: string | null;

    @Column({ nullable: true })
    cufe: string | null;

    @Column({ name: 'date_issue', type: 'datetime' })
    date_issue: Date;

    @Column({ type: 'double' })
    sale: number;

    @Column({ type: 'double' })
    subtotal: number;

    @Column({ type: 'double' })
    total: number;

    @Column({ name: 'total_discount', type: 'double' })
    total_discount: number;

    @Column({ name: 'total_tax', type: 'double' })
    total_tax: number;

    @Column({ name: 'ambient_id', type: 'int', unsigned: true })
    ambient_id: number;

    @Column({ nullable: true })
    pdf: string | null;

    @Column({ name: 'acu_recibo', type: 'boolean', default: false })
    acu_recibo: boolean;

    @Column({ name: 'rec_bienes', type: 'boolean', default: false })
    rec_bienes: boolean;

    @Column({ name: 'aceptacion', type: 'boolean', default: false })
    aceptacion: boolean;

    @Column({ name: 'rechazo', type: 'boolean', default: false })
    rechazo: boolean;

    @DeleteDateColumn({ name: 'deleted_at', nullable: true })
    deleted_at: Date | null;

    @CreateDateColumn({ name: 'created_at', nullable: true })
    created_at: Date | null;

    @UpdateDateColumn({ name: 'updated_at', nullable: true })
    updated_at: Date | null;

    @Column({ name: 'cude_acu_recibo', nullable: true })
    cude_acu_recibo: string | null;

    @Column({ name: 'payload_acu_recibo', type: 'json', nullable: true })
    payload_acu_recibo: any | null;

    @Column({ name: 'cude_rec_bienes', nullable: true })
    cude_rec_bienes: string | null;

    @Column({ name: 'payload_rec_bienes', type: 'json', nullable: true })
    payload_rec_bienes: any | null;

    @Column({ name: 'cude_aceptacion', nullable: true })
    cude_aceptacion: string | null;

    @Column({ name: 'payload_aceptacion', type: 'json', nullable: true })
    payload_aceptacion: any | null;

    @Column({ name: 'cude_rechazo', nullable: true })
    cude_rechazo: string | null;

    @Column({ name: 'payload_rechazo', type: 'json', nullable: true })
    payload_rechazo: any | null;

    @Column({ name: 'request_api', type: 'json', nullable: true })
    request_api: any | null;
} 