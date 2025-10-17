import { AdditionalDocumentDto, AllowanceChargeDto, BillingReferenceDto, LegalMonetaryTotalsDto, LineDto, PaymentExchangeRateDto, SellerOrCustomerDto, TaxTotalDto, InvoicePeriodDto } from '@/common/domain/interfaces/document-common.interface';

export interface CreditNoteRequestDto {
  type_document_id: number;
  prefix?: string;
  number?: number;
  type_operation_id?: number;
  resolution_number?: string;
  notes?: string[];
  date?: string;
  time?: string;
  type_currency_id?: string;
  exchange_rate?: number;
  exchange_rate_date?: string;
  establishment_name?: string;
  establishment_address?: string;
  establishment_phone?: string;
  establishment_municipality?: string;
  establishment_email?: string;
  establishment_department?: string;
  establishment_country?: string;
  establishment_postal_code?: string;
  billing_reference?: BillingReferenceDto;
  payment_exchange_rate?: PaymentExchangeRateDto;
  allowance_charges?: AllowanceChargeDto[];
  tax_totals?: TaxTotalDto[];
  withholding_tax_totals?: TaxTotalDto[];
  legal_monetary_totals: LegalMonetaryTotalsDto;
  credit_note_lines: LineDto[];
  additional_documents?: Array<AdditionalDocumentDto>;
  send_mail?: boolean;
  custom_fields?: Record<string, unknown>;
  customer: SellerOrCustomerDto;
  discrepancyresponsecode: number;
  head_note?: string;
  invoice_period?: InvoicePeriodDto;
  email_cc_list?: EmailCcData[];

}

export interface EmailCcData {
  email: string;
}