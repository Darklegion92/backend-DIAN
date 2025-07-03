import { ApiProperty } from '@nestjs/swagger';
import { 
  IsNotEmpty, 
  IsString} from 'class-validator';
import { CustomerDataDto, DeliveryDataDto, DeliveryPartyDataDto } from './customer-data.dto';
import { PaymentFormData, TaxTotalData, AllowanceChargeData, LegalMonetaryTotalData, PrepaidPaymentData } from './payment-data.dto';
import { InvoiceLineData, OrderReferenceData, HealthFieldData, SmtpParametersData } from './invoice-line-data.dto';

export class EmailCcDataDto {
  @ApiProperty({ description: 'Email address', example: 'cc@example.com' })
  @IsNotEmpty()
  @IsString()
  email: string;
}

export class AnnexDataDto {
  @ApiProperty({ description: 'Document in base64 format' })
  @IsNotEmpty()
  @IsString()
  document: string;

  @ApiProperty({ description: 'File extension', example: 'pdf' })
  @IsNotEmpty()
  @IsString()
  extension: string;
}

export class CreateInvoiceDto {
  // Campos adicionales del facturador
  ivaresponsable?: string;
  nombretipodocid?: string;
  tarifaica?: string;
  actividadeconomica?: string;
  email_pos_customer?: string;

  // Datos del establecimiento
  establishment_name?: string;
  establishment_address?: string;
  establishment_phone?: string;
  establishment_municipality?: number;
  establishment_email?: string;
  establishment_logo?: string;

  // Lista de correos copia
  email_cc_list?: EmailCcData[];

  // Anexos
  annexes?: AnnexData[];

  // HTML del email
  html_header?: string;
  html_body?: string;
  html_buttons?: string;
  html_footer?: string;

  // Template
  invoice_template?: string;
  template_token?: string;

  // Consultas
  query_uuid?: boolean;
  dont_send_yet?: boolean;

  // Campo dinámico
  dynamic_field?: {
    name: string;
    value: string;
    add_to_total?: boolean;
  };

  // Otros campos
  sales_assistant?: string;
  web_site?: string;
  atacheddocument_name_prefix?: string;
  seze?: string;
  foot_note?: string;
  head_note?: string;
  disable_confirmation_text?: boolean;

  // Envío de correos
  sendmail?: boolean;
  sendmailtome?: boolean;
  send_customer_credentials?: boolean;
  GuardarEn?: string;

  // Documento
  type_document_id: number;
  resolution_number?: string;
  prefix?: string;
  number: number;
  date?: string;
  time?: string;
  notes?: string;
  elaborated?: string;
  reviewed?: string;
  type_operation_id?: number;
  
  customer: CustomerDataDto;
  delivery?: DeliveryDataDto;
  deliveryparty?: DeliveryPartyDataDto;
  
  // Parámetros SMTP
  smtp_parameters?: SmtpParametersData;

  // Referencias
  order_reference?: OrderReferenceData;
  additional_document_reference?: {
    id?: string;
    date?: string;
    type_document_id?: number;
  };

  // Formas de pago
  payment_form?: PaymentFormData[];

  // Cargos y descuentos
  allowance_charges?: AllowanceChargeData[];

  // Impuestos
  tax_totals?: TaxTotalData[];
  with_holding_tax_total?: TaxTotalData[];

  // Pagos prepagados
  prepaid_payment?: PrepaidPaymentData;
  prepaid_payments?: PrepaidPaymentData[];
  previous_balance?: number;

  // Totales monetarios y líneas (requeridos)
  legal_monetary_totals: LegalMonetaryTotalData;
  invoice_lines: InvoiceLineData[];
  
  // Campos opcionales adicionales
  health_fields?: HealthFieldData;
}

export interface EmailCcData {
  email: string;
}

export interface AnnexData {
  document: string; // base64
  extension: string;
} 