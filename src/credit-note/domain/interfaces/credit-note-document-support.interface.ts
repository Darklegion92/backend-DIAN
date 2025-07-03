import { AllowanceChargeDto, AnnexDto, BillingReferenceDto, EmailCcDto, LegalMonetaryTotalsDto, LineDto, PaymentFormDto, SellerOrCustomerDto, SmtpParametersDto, TaxTotalDto } from "@/common/domain/interfaces/document-common.interface";

export interface SdCreditNoteRequestDto {
  // Adicionales Facturador
  ivaresponsable?: string;
  nombretipodocid?: string;
  tarifaica?: string;
  actividadeconomica?: string;

  // Datos del Establecimiento
  establishment_name?: string;
  establishment_address?: string;
  establishment_phone?: number;
  establishment_municipality?: number;
  establishment_email?: string;
  establishment_logo?: string;

  // Prefijo del Nombre del AttachedDocument
  atacheddocument_name_prefix?: string;

  // Regimen SEZE
  seze?: string;

  // Nota Encabezado y pie de pagina
  foot_note?: string;
  head_note?: string;

  // Desactivar texto de confirmacion de pago
  disable_confirmation_text?: boolean;

  // Enviar Correo al Adquiriente
  sendmail?: boolean;
  sendmailtome?: boolean;
  send_customer_credentials?: boolean;

  // Lista de correos a enviar copia
  email_cc_list?: EmailCcDto[];

  // Documentos en base64 para adjuntar en el attacheddocument
  annexes?: AnnexDto[];

  // HTML string body email
  html_header?: string;
  html_body?: string;
  html_buttons?: string;
  html_footer?: string;

  // Nombre Archivo
  GuardarEn?: string;

  // Document (REQUERIDO)
  type_document_id: 13; // Fijo para nota crédito de documento soporte

  // Date time
  date?: string; // Y-m-d
  time?: string; // H:i:s

  // Notes
  notes?: string;

  // Tipo operacion
  type_operation_id?: 23 | 24;

  // Resolution number for document sending
  resolution_number?: string;

  // Prefijo de la resolucion a utilizar
  prefix?: string;

  // Consecutive (REQUERIDO)
  number: number;

  // Respuesta de discrepancia
  discrepancyresponsecode?: number; // 1-6
  discrepancyresponsedescription?: string;

  // Billing Reference (REQUERIDO)
  billing_reference: BillingReferenceDto;

  // Id moneda negociacion
  idcurrency?: number;
  calculationrate?: number;
  calculationratedate?: string; // Y-m-d

  // Seller (REQUERIDO)
  seller: SellerOrCustomerDto;

  // SMTP Server Parameters
  smtp_parameters?: SmtpParametersDto;

  // Payment form
  payment_form?: PaymentFormDto;

  // Allowance charges
  allowance_charges?: AllowanceChargeDto[];

  // Tax totals
  tax_totals?: TaxTotalDto[];

  // Legal monetary totals (REQUERIDO)
  legal_monetary_totals: LegalMonetaryTotalsDto;

  // Credit note lines (REQUERIDO)
  credit_note_lines: LineDto[];
}
