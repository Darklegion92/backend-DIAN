/**
 * Interface para la referencia de facturación
 * Reutilizable en facturas, notas crédito, documentos soporte, etc.
 * Basada en la clase Java BillingReferenceVo
 */
export interface BillingReference {
  /**
   * Número del documento de referencia
   */
  number?: string;

  /**
   * UUID del documento de referencia
   */
  uuid?: string;

  /**
   * Fecha de emisión del documento de referencia
   */
  issue_date?: string;
}

/**
 * Interface para información del vendedor/emisor
 * Reutilizable en todos los tipos de documentos electrónicos
 * Basada en la clase Java SellerVo
 */
export interface Seller {
  identification_number: string;
  dv: string;
  name: string;
  phone: string;
  address: string;
  email: string;
  merchant_registration: string;
  type_document_identification_id: number;
  type_organization_id: string;
  type_liability_id: number;
  type_regime_id: number;
  postal_zone_code: string;
  municipality_id: number;
}

/**
 * Interface para ubicación física
 * Reutilizable para direcciones de vendedores, compradores, etc.
 */
export interface PhysicalLocationVo {
  address?: AddressVo;
  additional_account_id?: string;
}

/**
 * Interface para dirección
 * Reutilizable en múltiples contextos
 */
export interface AddressVo {
  id?: string;
  city_name?: string;
  postal_zone?: string;
  country_subentity?: string;
  country_subentity_code?: string;
  address_line?: AddressLineVo[];
  country?: CountryVo;
}

/**
 * Interface para línea de dirección
 */
export interface AddressLineVo {
  line?: string;
}

/**
 * Interface para país
 */
export interface CountryVo {
  identification_code?: string;
  name?: string;
}

/**
 * Interface para esquema de impuestos de la parte
 */
export interface PartyTaxSchemeVo {
  registration_name?: string;
  company_id?: string;
  tax_level_code?: string;
  exemption_reason_code?: string;
  exemption_reason?: string;
  tax_scheme?: TaxSchemeVo;
}

/**
 * Interface para esquema de impuestos
 */
export interface TaxSchemeVo {
  id?: string;
  name?: string;
}

/**
 * Interface para entidad legal de la parte
 */
export interface PartyLegalEntityVo {
  registration_name?: string;
  company_id?: string;
  corporate_registration_scheme?: CorporateRegistrationSchemeVo;
}

/**
 * Interface para esquema de registro corporativo
 */
export interface CorporateRegistrationSchemeVo {
  id?: string;
  name?: string;
}

/**
 * Interface para contacto
 */
export interface ContactVo {
  name?: string;
  telephone?: string;
  telefax?: string;
  electronic_mail?: string;
  note?: string;
}

/**
 * Interface para totales de impuestos
 * Reutilizable en facturas, notas crédito, documentos soporte, etc.
 */
export interface TaxTotalVo {
  tax_id?: string;
  tax_name?: string;
  percent?: number;
  tax_category?: string;
  tax_category_code?: string;
  taxable_amount?: number;
  tax_amount?: number;
  tax_evidence_indicator?: boolean;
  tax_scheme?: TaxSchemeVo;
}

/**
 * Interface para período de facturación
 * Reutilizable en facturas y notas crédito
 */
export interface InvoicePeriodVo {
  start_date?: string;
  end_date?: string;
  description?: string;
  description_code?: string;
  duration_measure?: string;
}

/**
 * Interface para totales monetarios legales
 * Reutilizable en facturas, notas crédito, documentos soporte, etc.
 */
export interface LegalMonetaryTotalsVo {
  line_extension_amount?: number;
  tax_exclusive_amount?: number;
  tax_inclusive_amount?: number;
  allowance_total_amount?: number;
  charge_total_amount?: number;
  pre_paid_amount?: number;
  payable_amount?: number;
  rounding_amount?: number;
}

/**
 * Interface para cargos y descuentos
 * Reutilizable en líneas de documentos
 */
export interface AllowanceChargeVo {
  id?: string;
  charge_indicator?: boolean;
  allowance_charge_reason_code?: string;
  allowance_charge_reason?: string;
  multiplier_factor_numeric?: number;
  amount?: number;
  base_amount?: number;
  tax_totals?: TaxTotalVo[];
}

/**
 * Interface para información de pago
 * Reutilizable en facturas y notas crédito
 */
export interface PaymentMeansVo {
  id?: string;
  payment_means_code?: string;
  payment_due_date?: string;
  payment_id?: string;
  payee_financial_account?: PayeeFinancialAccountVo;
}

/**
 * Interface para cuenta financiera del beneficiario
 */
export interface PayeeFinancialAccountVo {
  id?: string;
  name?: string;
  account_type_code?: string;
  financial_institution_branch?: FinancialInstitutionBranchVo;
}

/**
 * Interface para sucursal de institución financiera
 */
export interface FinancialInstitutionBranchVo {
  id?: string;
  name?: string;
}

/**
 * Interface para términos de pago
 * Reutilizable en facturas y notas crédito
 */
export interface PaymentTermsVo {
  reference_event_code?: string;
  settlement_discount_percent?: number;
  penalty_surcharge_percent?: number;
  payment_percent?: number;
  amount?: number;
  settlement_discount_amount?: number;
  penalty_amount?: number;
  payment_due_date?: string;
  installment_due_date?: string;
}

/**
 * Interface para información de entrega
 * Reutilizable en facturas y documentos soporte
 */
export interface DeliveryVo {
  id?: string;
  quantity?: number;
  actual_delivery_date?: string;
  actual_delivery_time?: string;
  latest_delivery_date?: string;
  delivery_location?: DeliveryLocationVo;
  delivery_party?: DeliveryPartyVo;
  despatch?: DespatchVo;
}

/**
 * Interface para ubicación de entrega
 */
export interface DeliveryLocationVo {
  id?: string;
  address?: AddressVo;
}

/**
 * Interface para parte de entrega
 */
export interface DeliveryPartyVo {
  party_identification?: string;
  party_name?: string;
  physical_location?: PhysicalLocationVo;
  contact?: ContactVo;
}

/**
 * Interface para despacho
 */
export interface DespatchVo {
  id?: string;
  requested_despatch_date?: string;
  requested_despatch_time?: string;
  estimated_despatch_date?: string;
  estimated_despatch_time?: string;
  despatch_address?: AddressVo;
  despatch_party?: DespatchPartyVo;
}

/**
 * Interface para parte de despacho
 */
export interface DespatchPartyVo {
  party_identification?: string;
  party_name?: string;
  physical_location?: PhysicalLocationVo;
  contact?: ContactVo;
} 


//TODO: nuevo

/**
 * Interface para vendedor o cliente
 */
export interface SellerOrCustomerDto {
  identification_number: string;
  dv?: string;
  type_document_identification_id?: number;
  type_organization_id?: number;
  language_id?: number;
  country_id?: number;
  municipality_id?: number;
  municipality_id_fact?: number;
  type_regime_id?: number;
  tax_id?: number;
  type_liability_id?: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  merchant_registration: string;
  postal_zone_code?: number;
} 

/**
 * Interface para totales de impuestos
 */
export interface TaxTotalDto {
  tax_id?: number;
  percent?: number;
  tax_amount?: number;
  taxable_amount?: number;
  unit_measure_id?: number;
  per_unit_amount?: number;
  base_unit_measure?: number;
  tax_name?: string;
}

/**
 * Interface para correo electrónico de copia
 */
export interface EmailCcDto {
  email: string;
}

/**
 * Interface para anexos en base64
 */
export interface AnnexDto {
  document: string;
  extension: string;
}

/**
 * Interface para referencia de facturación
 */
export interface BillingReferenceDto {
  number: string;
  uuid: string;
  issue_date: string; // Y-m-d
}

/**
 * Interface para parámetros SMTP
 */
export interface SmtpParametersDto {
  host?: string;
  port?: string;
  username?: string;
  password?: string;
  encryption?: string;
  from_address?: string;
  from_name?: string;
}

/**
 * Interface para forma de pago
 */
export interface PaymentFormDto {
  payment_form_id?: number;
  payment_method_id?: number;
  payment_due_date?: string;
  duration_measure?: number;
}

/**
 * Interface para cargos y descuentos del documento
 */
export interface AllowanceChargeDto {
  charge_indicator?: boolean;
  discount_id?: number;
  allowance_charge_reason?: string;
  amount?: number;
  base_amount?: number;
}

/**
 * Interface para totales monetarios legales
 */
export interface LegalMonetaryTotalsDto {
  line_extension_amount: number;
  tax_exclusive_amount: number;
  tax_inclusive_amount: number;
  allowance_total_amount?: number;
  charge_total_amount?: number;
  payable_amount: number;
}

/**
 * Interface para línea de factura
 */
export interface LineDto{
  unit_measure_id: number;
  invoiced_quantity: number;
  line_extension_amount: number;
  free_of_charge_indicator: boolean;
  reference_price_id?: number;
  allowance_charges?: AllowanceChargeDto[];
  tax_totals?: TaxTotalDto[];
  description: string;
  notes?: string;
  code: string;
  type_item_identification_id: number;
  price_amount: number;
  base_quantity: number;
}

/**
 * Interface para tasa de cambio de pago
 */
export interface PaymentExchangeRateDto{
  source_currency_code: string;
  target_currency_code: string;
  calculation_rate: number;
  date: string;
};

/**
 * Interface para documento adicional
 */
export interface AdditionalDocumentDto{
  id: string;
  type: string;
  date?: string;
  description?: string;
}

/**
 * Interface para datos de entrega
 */
export interface DeliveryDataDto{
    language_id?: number;
    country_id?: number;
    municipality_id?: number;
    address: string; // REQUERIDO
    actual_delivery_date: string; // REQUERIDO, formato: Y-m-d
  }
/**
 * Parte que entrega
 */
export interface DeliveryPartyDto {
  identification_number: number; // REQUERIDO
  type_document_identification_id?: number;
  type_organization_id?: number;
  language_id?: number;
  country_id?: number;
  municipality_id?: number;
  type_regime_id?: number;
  tax_id?: number;
  type_liability_id?: number;
  name: string; // REQUERIDO
  phone: string; // REQUERIDO
  address: string; // REQUERIDO
  email: string; // REQUERIDO
  merchant_registration?: string;
}

export interface OrderReferenceDto {
    id_order?: string;
    issue_date_order?: string; // Formato: Y-m-d
  }
/**
 * Pago prepagado
 */
export interface PrepaidPaymentDto {
  idpayment?: string;
  prepaid_payment_type_id?: number;
  paidamount?: number;
  receiveddate?: string; // Formato: Y-m-d
  paiddate?: string; // Formato: Y-m-d
  instructionid?: string;
}