import { TaxTotalData, AllowanceChargeData } from './payment-data.dto';

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

export interface SmtpParametersData {
  host: string;
  port: string;
  username: string;
  password: string;
  encryption: string;
  from_address?: string;
  from_name?: string;
} 