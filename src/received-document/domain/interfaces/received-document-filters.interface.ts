import { ApiProperty } from '@nestjs/swagger';

export class ReceivedDocumentFilters {
    @ApiProperty({
        description: 'Fecha de inicio para filtrar documentos (YYYY-MM-DD)',
        type: String,
        required: false,
        example: '2024-01-01'
    })
    startDate?: string;

    @ApiProperty({
        description: 'Fecha fin para filtrar documentos (YYYY-MM-DD)',
        type: String,
        required: false,
        example: '2024-12-31'
    })
    endDate?: string;

    @ApiProperty({
        description: 'Identificación del vendedor',
        type: Number,
        required: false,
        example: 900123456
    })
    identification_number?: number;

    @ApiProperty({
        description: 'Nombre del vendedor',
        type: String,
        required: false,
        example: 'EMPRESA VENDEDORA S.A.S'
    })
    name_seller?: string;

    @ApiProperty({
        description: 'Estado del documento',
        type: Number,
        required: false,
        example: 1
    })
    state_document_id?: number;

    @ApiProperty({
        description: 'ID del tipo de documento',
        type: Number,
        required: false,
        example: 1
    })
    type_document_id?: number;

    @ApiProperty({
        description: 'Identificación del cliente',
        type: String,
        required: false,
        example: '900123456'
    })
    customer?: string;

    @ApiProperty({
        description: 'Nombre del cliente',
        type: String,
        required: false,
        example: 'EMPRESA CLIENTE S.A.S'
    })
    customer_name?: string;

    @ApiProperty({
        description: 'Prefijo del documento',
        type: String,
        required: false,
        example: 'FEVA'
    })
    prefix?: string;

    @ApiProperty({
        description: 'Número del documento',
        type: String,
        required: false,
        example: '1001'
    })
    number?: string;

    @ApiProperty({
        description: 'CUFE del documento',
        type: String,
        required: false,
        example: 'a1b2c3d4-e5f6-g7h8-i9j0'
    })
    cufe?: string;

    @ApiProperty({
        description: 'Rango mínimo del valor total',
        type: Number,
        required: false,
        example: 1000000
    })
    min_total?: number;

    @ApiProperty({
        description: 'Rango máximo del valor total',
        type: Number,
        required: false,
        example: 5000000
    })
    max_total?: number;

    @ApiProperty({
        description: 'Estado del acuse de recibo',
        type: Boolean,
        required: false,
        example: false
    })
    acu_recibo?: boolean;

    @ApiProperty({
        description: 'Estado de recepción de bienes',
        type: Boolean,
        required: false,
        example: false
    })
    rec_bienes?: boolean;

    @ApiProperty({
        description: 'Estado de aceptación',
        type: Boolean,
        required: false,
        example: false
    })
    aceptacion?: boolean;

    @ApiProperty({
        description: 'Estado de rechazo',
        type: Boolean,
        required: false,
        example: false
    })
    rechazo?: boolean;

    @ApiProperty({
        description: 'ID del ambiente (1: Pruebas, 2: Producción)',
        type: Number,
        required: false,
        example: 2
    })
    ambient_id?: number;

    @ApiProperty({
        description: 'Número de página (comienza en 1)',
        type: Number,
        required: false,
        minimum: 1,
        default: 1,
        example: 1
    })
    page?: number;

    @ApiProperty({
        description: 'Límite de registros por página',
        type: Number,
        required: false,
        minimum: 1,
        default: 10,
        example: 10
    })
    limit?: number;
}

export interface ImapReceiptAcknowledgmentRequest {
    start_date: string;         // Fecha de inicio en formato YYYY-MM-DD
    end_date?: string;          // Fecha fin en formato YYYY-MM-DD
    last_event?: number;        // Último evento (0 por defecto)
    base64_attacheddocument?: boolean;  // Si se requiere el documento adjunto en base64
    only_read?: boolean;        // Si solo se deben leer los correos
}

export interface ImapReceiptAcknowledgmentResponse {
    status?: number;           // Estado de la respuesta HTTP
    message?: string;          // Mensaje de la respuesta
    data?: {
        // Los datos específicos que retorna el servicio
        [key: string]: any;    // Estructura dinámica basada en la respuesta
    };
}

export interface DataSendInvoiceEvent {
    event_id: string;
    document_reference: DocumentReference;
    issuer_party: IssuerParty;
  }

  interface DocumentReference {
    cufe: string;
  }

  interface IssuerParty {
    identification_number: string;
    first_name: string;
    last_name: string;
    organization_department: string;
    job_title: string;
  }

  export interface ResponseEventDian {
    success: boolean;
    message: string;
    ResponseDian: ResponseDianSendEvent,
    cude: string,
    certificate_days_left: number,
    transmitter_id?: string,
    transmitter_name?: string,
    receiver_id?: number,
    receiver_name?: string,
    invoice_number?: string,
    invoice_date?: string,
    invoice_cufe?: string,
    invoice_total?: number,
    invoice_tax?: number
}

export interface ResponseDianSendEvent {
    Envelope: Envelope;
};

interface Envelope {
    Body: Body;
};

interface Body {
    SendEventUpdateStatusResponse: SendEventUpdateStatusResponse;
};

interface SendEventUpdateStatusResponse {
    SendEventUpdateStatusResult: SendEventUpdateStatusResult;
};

interface SendEventUpdateStatusResult {
    ErrorMessage: {
        string: string;
        strings: string[];
    };
    IsValid: string;
};

export interface ResponseSendEvent{
    success: boolean;
    message: string;
}



