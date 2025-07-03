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

export interface PrepaidPaymentData {
  idpayment?: string;
  prepaid_payment_type_id?: number;
  paidamount?: number;
  receiveddate?: string;
  paiddate?: string;
  instructionid?: string;
} 