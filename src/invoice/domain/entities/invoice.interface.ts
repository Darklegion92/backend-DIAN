export interface InvoiceEntity {
  id: string;
  number: string;
  prefix?: string;
  companyNit: string;
  customerNit: string;
  customerName: string;
  issueDate: Date;
  dueDate?: Date;
  cufe: string;
  totalAmount: number;
  taxAmount: number;
  status: InvoiceStatus;
  notes?: string;
  lines: InvoiceLineEntity[];
}

export interface InvoiceLineEntity {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  totalAmount: number;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export interface InvoiceListResponse {
  invoices: InvoiceEntity[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Interfaces para el Request de Factura (Laravel)
export interface CreateInvoiceRequest {
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
  resolutionNumber?: string;
  prefix?: string;
  number: number;
  date?: string;
  time?: string;
  notes?: string;
  elaborated?: string;
  reviewed?: string;
  type_operation_id?: number;
  
  customer: CustomerData;
  delivery?: DeliveryData;
  deliveryparty?: DeliveryPartyData;
  
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

export interface CustomerData {
  identification_number: string;
  name: string;
  dv?: number;
  type_document_identification_id?: number;
  type_organization_id?: number;
  language_id?: number;
  country_id?: number;
  municipality_id?: number;
  municipality_id_fact?: string;
  first_name?: string;
  family_first_surname?: string;
  family_second_surname?: string;
  middle_name?: string;
  address?: string;
  email?: string;
  phone?: string;
  merchant_registration?: string;
  
  // Datos de la empresa del cliente
  business_name?: string;
  type_regime_id?: number;
  type_liability_id?: number;
}

export interface DeliveryData {
  language_id?: number;
  country_id?: number;
  municipality_id?: number;
  address: string;
  actual_delivery_date: string;
}

export interface DeliveryPartyData {
  identification_number: string;
  dv?: number;
  type_document_identification_id?: number;
  type_organization_id?: number;
  language_id?: number;
  country_id?: number;
  municipality_id?: number;
  type_regime_id?: number;
  tax_id?: number;
  type_liability_id?: number;
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  merchant_registration?: string;
}

export interface PaymentFormData {
  payment_form_id?: number;
  payment_method_id?: number;
  payment_due_date?: string;
  duration_measure?: number;
}

export interface TaxTotalData {
  tax_id?: number;
  tax_name?: string;
  tax_amount?: number;
  taxable_amount?: number;
  percent?: number;
  unit_measure_id?: number;
  per_unit_amount?: number;
  base_unit_measure?: number;
}

export interface AllowanceChargeData {
  charge_indicator?: boolean;
  discount_id?: number;
  allowance_charge_reason?: string;
  amount?: number;
  base_amount?: number;
  multiplier_factor_numeric?: number;
}

export interface LegalMonetaryTotalData {
  line_extension_amount: number;
  tax_exclusive_amount: number;
  tax_inclusive_amount: number;
  allowance_total_amount?: number;
  charge_total_amount?: number;
  pre_paid_amount?: number;
  payable_amount: number;
}

export interface InvoiceLineData {
  unit_measure_id: number;
  invoiced_quantity: number;
  line_extension_amount: number;
  free_of_charge_indicator: boolean;
  reference_price_id?: number;
  description: string;
  notes?: string;
  code: string;
  type_item_identification_id: number;
  price_amount: number;
  base_quantity: number;
  
  tax_totals?: TaxTotalData[];
  allowance_charges?: AllowanceChargeData[];
}

export interface OrderReferenceData {
  id_order?: string;
  issue_date_order?: string;
}

export interface HealthFieldData {
  health_type_document_identification_id?: number;
  health_type_user_id?: number;
  health_first_surname?: string;
  health_second_surname?: string;
  health_first_name?: string;
  health_middle_name?: string;
  health_policy_number?: string;
  health_contracting_payment_method_id?: number;
  health_coverage_id?: number;
}

export interface PrepaidPaymentData {
  idpayment?: string;
  prepaid_payment_type_id?: number;
  paidamount?: number;
  receiveddate?: string;
  paiddate?: string;
  instructionid?: string;
}

export interface SmtpParametersData {
  host: string;
  port: string;
  username: string;
  password: string;
  encryption: string;
  from_address?: string;
  from_name?: string;
}

export interface EmailCcData {
  email: string;
}

export interface AnnexData {
  document: string; // base64
  extension: string;
}

// Interfaces para la respuesta completa de la DIAN
export interface DianeTimestamp {
  _attributes: {
    Id: string;
  };
  Created: string;
  Expires: string;
}

export interface DianeHeader {
  Action: {
    _attributes: {
      mustUnderstand: string;
    };
    _value: string;
  };
  Security: {
    _attributes: {
      mustUnderstand: string;
    };
    Timestamp: DianeTimestamp;
  };
}

export interface DianeErrorMessage {
  string?: string;
  strings?: string[];
}

export interface DianeSendBillSyncResult {
  ErrorMessage: DianeErrorMessage;
  IsValid: string;
  StatusCode: string;
  StatusDescription: string;
  StatusMessage: string;
  XmlBase64Bytes: string;
}

export interface DianeSendBillSyncResponse {
  SendBillSyncResult: DianeSendBillSyncResult;
}

export interface DianeBody {
  SendBillSyncResponse: DianeSendBillSyncResponse;
}

export interface DianeEnvelope {
  Header: DianeHeader;
  Body: DianeBody;
}

export interface DianeResponseData {
  Envelope: DianeEnvelope;
}

export interface InvoiceCreationData {

}

export interface CreateInvoiceResponse {
  cufe?: string;
  success?: boolean;
  message?: string;
  data?: InvoiceCreationData;
  send_email_success?: boolean;
  send_email_date_time?: boolean;
  urlinvoicexml?: string;
  urlinvoicepdf?: string;
  urlinvoiceattached?: string;
  QRStr?: string;
  certificate_days_left?: number;
  resolution_days_left?: number;
  ResponseDian?: DianeResponseData;
}




