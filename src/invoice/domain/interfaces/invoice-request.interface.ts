import { AllowanceChargeDto, DeliveryDataDto, DeliveryPartyDto, EmailCcDto, LegalMonetaryTotalsDto, LineDto, OrderReferenceDto, PaymentFormDto, PrepaidPaymentDto, SellerOrCustomerDto, TaxTotalDto } from "@/common/domain/interfaces/document-common.interface";

/**
 * Interfaz para el cuerpo de la petición del endpoint de factura electrónica
 * Basado en InvoiceRequest del API DIAN
 */
export interface InvoiceRequestDto {
  // Campos adicionales del facturador
  ivaresponsable?: string;
  nombretipodocid?: string;
  tarifaica?: string;
  actividadeconomica?: string;
  email_pos_customer?: string;

  // Datos del establecimiento
  establishment_name?: string;
  establishment_address?: string;
  establishment_phone?: number;
  establishment_municipality?: number;
  establishment_email?: string;
  establishment_logo?: string;

  // Documento - REQUERIDO
  type_document_id: number; // Siempre 1 para facturas

  // Número de resolución (requerido si hay múltiples resoluciones)
  resolution_number?: string;
  
  // Prefijo (requerido si hay múltiples resoluciones con el mismo número)
  prefix?: string;

  // Consecutivo - REQUERIDO
  number: number;

  // Fecha y hora
  date?: string; // Formato: Y-m-d
  time?: string; // Formato: H:i:s

  // Notas
  notes?: string;

  // Elaborado y revisado
  elaborated?: string;
  reviewed?: string;

  // Tipo de operación
  type_operation_id?: number;

  // Cliente - REQUERIDO
  customer: SellerOrCustomerDto;

  // Totales monetarios legales - REQUERIDO
  legal_monetary_totals: LegalMonetaryTotalsDto;

  // Líneas de factura - REQUERIDO
  invoice_lines: LineDto[];

  // Opciones de configuración
  sendmail?: boolean;
  sendmailtome?: boolean;
  dont_send_yet?: boolean;
  query_uuid?: boolean;

  // Forma de pago
  payment_form?: PaymentFormDto[];

  // Cargos y descuentos
  allowance_charges?: AllowanceChargeDto[];

  // Totales de impuestos
  tax_totals?: TaxTotalDto[];

  // Retenciones
  with_holding_tax_total?: TaxTotalDto[];

  // Entrega
  delivery?: DeliveryDataDto;
  deliveryparty?: DeliveryPartyDto;

  // Referencia de orden
  order_reference?: OrderReferenceDto;

  // Pago prepagado
  prepaid_payment?: PrepaidPaymentDto;

  // Email CC
  email_cc_list?: EmailCcDto[];
}

///**
// * Datos del cliente
// */
//export interface CustomerDataDto {
//  identification_number: string; // REQUERIDO
//  dv?: number;
//  type_document_identification_id?: number;
//  type_organization_id?: number;
//  language_id?: number;
//  country_id?: number;
//  municipality_id?: number;
//  municipality_id_fact?: string;
//  type_regime_id?: number;
//  tax_id?: number;
//  type_liability_id?: number;
//  name: string; // REQUERIDO
//  phone?: string;
//  address?: string;
//  email: string; // REQUERIDO (excepto para ciertos NITs)
//  merchant_registration?: string;
//}
//
///**
// * Totales monetarios legales
// */
//export interface LegalMonetaryTotalsDto {
//  line_extension_amount: number; // REQUERIDO
//  tax_exclusive_amount: number; // REQUERIDO
//  tax_inclusive_amount: number; // REQUERIDO
//  allowance_total_amount?: number;
//  charge_total_amount?: number;
//  pre_paid_amount?: number;
//  payable_amount: number; // REQUERIDO
//}
//
///**
// * Línea de factura
// */
//export interface InvoiceLineDto {
//  unit_measure_id: number; // REQUERIDO
//  invoiced_quantity: number; // REQUERIDO
//  line_extension_amount: number; // REQUERIDO
//  free_of_charge_indicator: boolean; // REQUERIDO
//  reference_price_id?: number;
//  allowance_charges?: AllowanceCharge[];
//  tax_totals?: TaxTotal[];
//  description: string; // REQUERIDO
//  notes?: string;
//  code: string; // REQUERIDO
//  type_item_identification_id: number; // REQUERIDO
//  price_amount: number; // REQUERIDO
//  base_quantity: number; // REQUERIDO
//}
//
///**
// * Forma de pago
// */
//export interface PaymentFormDto {
//  payment_form_id?: number;
//  payment_method_id?: number;
//  payment_due_date?: string; // Formato: Y-m-d
//  duration_measure?: number;
//}
//
///**
// * Cargo o descuento
// */
//export interface AllowanceChargeDto {
//  charge_indicator: boolean; // REQUERIDO
//  discount_id?: number;
//  allowance_charge_reason: string; // REQUERIDO
//  amount: number; // REQUERIDO
//  base_amount?: number;
//  multiplier_factor_numeric?: number;
//}
//
///**
// * Total de impuesto
// */
//export interface TaxTotalDto {
//  tax_id: number; // REQUERIDO
//  tax_name?: string;
//  percent?: number;
//  tax_amount: number; // REQUERIDO
//  taxable_amount: number; // REQUERIDO
//  unit_measure_id?: number;
//  per_unit_amount?: number;
//  base_unit_measure?: number;
//}
//
///**
// * Campos de salud
// */
//export interface HealthFields {
//  print_users_info_to_pdf?: boolean;
//  invoice_period_start_date: string; // REQUERIDO, formato: Y-m-d
//  invoice_period_end_date: string; // REQUERIDO, formato: Y-m-d
//  health_type_operation_id: number; // REQUERIDO
//  users_info?: HealthUserInfo[];
//}
//
///**
// * Información de usuario de salud
// */
//export interface HealthUserInfo {
//  provider_code?: string;
//  health_type_document_identification_id?: number;
//  identification_number?: string;
//  surname?: string;
//  second_surname?: string;
//  first_name?: string;
//  middle_name?: string;
//  health_type_user_id?: number;
//  health_contracting_payment_method_id: number; // REQUERIDO
//  health_coverage_id: number; // REQUERIDO
//  autorization_numbers?: string;
//  mipres?: string;
//  mipres_delivery?: string;
//  contract_number?: string;
//  policy_number?: string;
//  co_payment?: number;
//  moderating_fee?: number;
//  recovery_fee?: number;
//  shared_payment?: number;
//  advance_payment?: number;
//}
//
 