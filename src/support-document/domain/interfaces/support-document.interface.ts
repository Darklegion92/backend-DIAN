import { AllowanceChargeDto, LegalMonetaryTotalsDto, LineDto, PaymentFormDto, SellerOrCustomerDto, TaxTotalDto } from "@/common/domain/interfaces/document-common.interface";

export interface SupportDocumentRequestDto {
    number: number;
    type_document_id: number;
    date: string;
    time: string;
    notes?: string;
    sendmail: boolean;
    resolution_number: string;
    prefix: string;
    seller: SellerOrCustomerDto;
    type_operation_id?: number;
    payment_form: PaymentFormDto[];
    allowance_charges?: AllowanceChargeDto[];
    legal_monetary_totals: LegalMonetaryTotalsDto;
    tax_totals?: TaxTotalDto[];
    invoice_lines: LineDto[];
    withholding_tax_totals?: TaxTotalDto[];
}