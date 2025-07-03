import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('received_documents')
export class ReceivedDocument {
    @ApiProperty({
        description: 'Identificador único del documento',
        type: Number,
        example: 1
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Número de identificación del vendedor',
        type: Number,
        example: 900123456
    })
    @Column()
    identification_number: number;

    @ApiProperty({
        description: 'Dígito de verificación del vendedor',
        type: String,
        example: '1'
    })
    @Column()
    dv: string;

    @ApiProperty({
        description: 'Nombre del vendedor',
        type: String,
        example: 'EMPRESA VENDEDORA S.A.S'
    })
    @Column()
    name_seller: string;

    @ApiProperty({
        description: 'ID del estado del documento',
        type: Number,
        example: 1
    })
    @Column()
    state_document_id: number;

    @ApiProperty({
        description: 'ID del tipo de documento',
        type: Number,
        example: 1
    })
    @Column()
    type_document_id: number;

    @ApiProperty({
        description: 'Identificación del cliente',
        type: String,
        example: '900123456'
    })
    @Column()
    customer: string;

    @ApiProperty({
        description: 'Nombre del cliente',
        type: String,
        example: 'EMPRESA CLIENTE S.A.S',
        nullable: true
    })
    @Column({ nullable: true })
    customer_name: string | null;

    @ApiProperty({
        description: 'Prefijo del documento',
        type: String,
        example: 'FEVA',
        nullable: true
    })
    @Column({ nullable: true })
    prefix: string | null;

    @ApiProperty({
        description: 'Número del documento',
        type: String,
        example: '1001'
    })
    @Column()
    number: string;

    @ApiProperty({
        description: 'Ruta del archivo XML',
        type: String,
        example: 'path/to/xml',
        nullable: true
    })
    @Column({ nullable: true })
    xml: string | null;

    @ApiProperty({
        description: 'CUFE del documento',
        type: String,
        example: 'a1b2c3d4-e5f6-g7h8-i9j0',
        nullable: true
    })
    @Column({ nullable: true })
    cufe: string | null;

    @ApiProperty({
        description: 'Fecha de emisión del documento',
        type: Date,
        example: '2024-01-01T00:00:00.000Z'
    })
    @Column()
    date_issue: Date;

    @ApiProperty({
        description: 'Valor de la venta',
        type: Number,
        example: 1000000
    })
    @Column('decimal', { precision: 15, scale: 2 })
    sale: number;

    @ApiProperty({
        description: 'Subtotal del documento',
        type: Number,
        example: 840336.13
    })
    @Column('decimal', { precision: 15, scale: 2 })
    subtotal: number;

    @ApiProperty({
        description: 'Total del documento',
        type: Number,
        example: 1000000
    })
    @Column('decimal', { precision: 15, scale: 2 })
    total: number;

    @ApiProperty({
        description: 'Total descuentos',
        type: Number,
        example: 0
    })
    @Column('decimal', { precision: 15, scale: 2 })
    total_discount: number;

    @ApiProperty({
        description: 'Total impuestos',
        type: Number,
        example: 159663.87
    })
    @Column('decimal', { precision: 15, scale: 2 })
    total_tax: number;

    @ApiProperty({
        description: 'ID del ambiente (1: Producción, 2: Pruebas)',
        type: Number,
        example: 1
    })
    @Column()
    ambient_id: number;

    @ApiProperty({
        description: 'Ruta del archivo PDF',
        type: String,
        example: 'path/to/pdf',
        nullable: true
    })
    @Column({ nullable: true })
    pdf: string | null;

    @ApiProperty({
        description: 'Estado del acuse de recibo',
        type: Boolean,
        example: false,
        default: false
    })
    @Column({ default: false })
    acu_recibo: boolean;

    @ApiProperty({
        description: 'Estado de recepción de bienes',
        type: Boolean,
        example: false,
        default: false
    })
    @Column({ default: false })
    rec_bienes: boolean;

    @ApiProperty({
        description: 'Estado de aceptación',
        type: Boolean,
        example: false,
        default: false
    })
    @Column({ default: false })
    aceptacion: boolean;

    @ApiProperty({
        description: 'Estado de rechazo',
        type: Boolean,
        example: false,
        default: false
    })
    @Column({ default: false })
    rechazo: boolean;

    @ApiProperty({
        description: 'Fecha de eliminación',
        type: Date,
        nullable: true
    })
    @Column({ nullable: true })
    deleted_at: Date | null;

    @ApiProperty({
        description: 'Fecha de creación del registro',
        type: Date,
        nullable: true
    })
    @Column({ nullable: true })
    created_at: Date | null;

    @ApiProperty({
        description: 'Fecha de última actualización',
        type: Date,
        nullable: true
    })
    @Column({ nullable: true })
    updated_at: Date | null;

    @ApiProperty({
        description: 'CUDE del acuse de recibo',
        type: String,
        nullable: true
    })
    cude_acu_recibo: string | null;

    @ApiProperty({
        description: 'Payload del acuse de recibo',
        type: 'object',
        nullable: true,
        additionalProperties: true
    })
    payload_acu_recibo: any | null;

    @ApiProperty({
        description: 'CUDE de recepción de bienes',
        type: String,
        nullable: true
    })
    cude_rec_bienes: string | null;

    @ApiProperty({
        description: 'Payload de recepción de bienes',
        type: 'object',
        nullable: true,
        additionalProperties: true
    })
    payload_rec_bienes: any | null;

    @ApiProperty({
        description: 'CUDE de aceptación',
        type: String,
        nullable: true
    })
    cude_aceptacion: string | null;

    @ApiProperty({
        description: 'Payload de aceptación',
        type: 'object',
        nullable: true,
        additionalProperties: true
    })
    payload_aceptacion: any | null;

    @ApiProperty({
        description: 'CUDE de rechazo',
        type: String,
        nullable: true
    })
    cude_rechazo: string | null;

    @ApiProperty({
        description: 'Payload de rechazo',
        type: 'object',
        nullable: true,
        additionalProperties: true
    })
    payload_rechazo: any | null;

    @ApiProperty({
        description: 'Request API',
        type: 'object',
        nullable: true,
        additionalProperties: true
    })
    request_api: any | null;
} 