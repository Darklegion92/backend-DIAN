export interface TaxTotal {
  tax_id: number;
  tax_amount: number;
  taxable_amount: number;
  percent?: number;
  unit_measure_id?: number;
  per_unit_amount?: number;
  base_unit_measure?: number;
  tax_name?: string;
}

export interface AllowanceCharge {
  charge_indicator: boolean;
  allowance_charge_reason: string;
  amount: number;
  base_amount: number;
  multiplier_factor_numeric?: number;
  sequence?: number;
  discount_id?: number;
}

export interface MonetaryTotal {
  line_extension_amount: number;
  tax_exclusive_amount: number;
  tax_inclusive_amount: number;
  allowance_total_amount?: number;
  charge_total_amount?: number;
  pre_paid_amount?: number;
  payable_amount: number;
}

export interface BillingReference {
  number: string;
  uuid: string;
  issue_date: string;
  scheme_name?: string;
  scheme_id?: string;
  document_type_code?: string;
}

export interface DiscrepancyResponse {
  reference_id: number;
  description: string;
  code?: string;
  validation_code?: string;
}

export interface CreditNoteLine {
  unit_measure_id: number;
  invoiced_quantity: number;
  line_extension_amount: number;
  free_of_charge_indicator?: boolean;
  allowance_charges?: AllowanceCharge[];
  tax_totals?: TaxTotal[];
  description: string;
  brand_name?: string;
  model_name?: string;
  notes?: string[];
  code?: string;
  type_item_identification_id?: number;
  price_amount: number;
  base_quantity?: number;
  multiplier_factor_numeric?: number;
  standard_item_identification?: {
    id: string;
    scheme_id?: string;
    scheme_name?: string;
  };
  additional_properties?: Array<{
    name: string;
    value: string;
  }>;
  reference_price_id?: number;
}

export interface OrderReference {
  id: string;
  issue_date?: string;
  uuid?: string;
  document_type_code?: string;
}

export interface CreditNoteRequest {
  // Información del documento
  type_document_id: number;
  prefix?: string;
  number?: string;
  type_operation_id?: number;
  resolution_number?: string;
  notes?: string[];
  date?: string;
  time?: string;
  type_currency_id?: string;
  exchange_rate?: number;
  exchange_rate_date?: string;

  // Información del establecimiento
  establishment_name?: string;
  establishment_address?: string;
  establishment_phone?: string;
  establishment_municipality?: string;
  establishment_email?: string;
  establishment_department?: string;
  establishment_country?: string;
  establishment_postal_code?: string;

  // Referencias y respuestas
  billing_reference: BillingReference;
  order_reference?: OrderReference;

  // Información de pago
  payment_exchange_rate?: {
    source_currency_code: string;
    target_currency_code: string;
    calculation_rate: number;
    date: string;
  };

  // Cargos, descuentos e impuestos
  allowance_charges?: AllowanceCharge[];
  tax_totals?: TaxTotal[];
  withholding_tax_totals?: TaxTotal[];

  // Totales monetarios
  legal_monetary_total: MonetaryTotal;

  // Líneas de la nota crédito
  credit_note_lines: CreditNoteLine[];

  // Campos adicionales
  additional_documents?: Array<{
    id: string;
    type: string;
    date?: string;
    description?: string;
  }>;
  send_mail?: boolean;
  custom_fields?: Record<string, unknown>;
  customer: Customer;
  discrepancyresponsecode: number;
  head_note?: string;

}

export interface Customer{
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

export interface CreditNoteResponse {
  message:               string;
  send_email_success:    boolean;
  send_email_date_time:  boolean;
  ResponseDian:          ResponseDian;
  invoicexml:            string;
  zipinvoicexml:         string;
  unsignedinvoicexml:    string;
  reqfe:                 string;
  rptafe:                string;
  attacheddocument:      string;
  urlinvoicexml:         string;
  urlinvoicepdf:         string;
  urlinvoiceattached:    string;
  cude:                  string;
  QRStr:                 string;
  certificate_days_left: number;
  customer?: string
}

export interface ResponseDian {
  Envelope: Envelope;
}

export interface Envelope {
  Header: Header;
  Body:   Body;
}

export interface Body {
  SendBillSyncResponse: SendBillSyncResponse;
}

export interface SendBillSyncResponse {
  SendBillSyncResult: SendBillSyncResult;
}

export interface SendBillSyncResult {
  ErrorMessage:      ErrorMessage;
  IsValid:           string;
  StatusCode:        string;
  StatusDescription: string;
  StatusMessage:     string;
  XmlBase64Bytes:    string;
  XmlBytes:          XMLBytes;
  XmlDocumentKey:    string;
  XmlFileName:       string;
}

export interface ErrorMessage {
  string: string;
  strings: string[];
}

export interface XMLBytes {
  _attributes: XMLBytesAttributes;
}

export interface XMLBytesAttributes {
  nil: string;
}

export interface Header {
  Action:   Action;
  Security: Security;
}

export interface Action {
  _attributes: ActionAttributes;
  _value:      string;
}

export interface ActionAttributes {
  mustUnderstand: string;
}

export interface Security {
  _attributes: ActionAttributes;
  Timestamp:   Timestamp;
}

export interface Timestamp {
  _attributes: TimestampAttributes;
  Created:     Date;
  Expires:     Date;
}

export interface TimestampAttributes {
  Id: string;
}
