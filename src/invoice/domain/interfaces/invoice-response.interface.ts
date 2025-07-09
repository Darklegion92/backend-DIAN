/**
 * Interfaz para la respuesta del endpoint de factura electrónica
 * Basado en el método responseStore del InvoiceController del API DIAN
 */
export interface InvoiceResponseDto {
  success: boolean;
  message: string;
  send_email_success: boolean;
  send_email_date_time: string;
  urlinvoicexml: string;
  urlinvoicepdf: string;
  urlinvoiceattached: string;
  cufe: string;
  QRStr: string;
  certificate_days_left: number;
  resolution_days_left: number;
  ResponseDian: DianResponseDto;
  invoicexml: string; // Base64
  zipinvoicexml: string; // Base64
  unsignedinvoicexml: string; // Base64
  reqfe: string | null; // Base64
  rptafe: string | null; // Base64
  attacheddocument: string; // Base64
}

/**
 * Respuesta de la DIAN
 */
export interface DianResponseDto {
  Envelope: EnvelopedDto;
}

export interface HeaderDto {
  Action: ActionDto;
  Security: SecurityDto;
  Timestamp: TimestampDto;
}

export interface SecurityDto {
  "_attributes": AttributesDto;
  "Timestamp": TimestampDto;
}
export interface TimestampDto {
  "_attributes": AttributesDto;
  "Created": string;
  "Expires": string;
}

export interface ActionDto {
  "_attributes": AttributesDto;
  "_value": string;
}

export interface AttributesDto {
  "mustUnderstand": string;
}

export interface EnvelopedDto {
  Header: HeaderDto;
  Body: BodyDto;

}

export interface BodyDto {
  SendBillSyncResponse: SendBillSyncResponseDto;
}

export interface SendBillSyncResponseDto {
  SendBillSyncResult: SendBillSyncResultDto;
}

export interface SendBillSyncResultDto {
    ErrorMessage: ErrorMessageDto;
  IsValid: string;
  StatusCode: string;
  StatusDescription: string;
  StatusMessage: string;
  XmlBase64Bytes: string;
}

export interface ErrorMessageDto {
  string: string;
  strings: string[];
}

/**
 * Respuesta de error del endpoint de invoice
 */
export interface InvoiceErrorResponseDto {
  success: false;
  message: string;
  errors?: {
    [field: string]: string[];
  };
}

/**
 * Respuesta de vista preliminar de factura
 */
export interface InvoicePreviewResponseDto {
  success: boolean;
  message: string;
  urlinvoicepdf: string;
  base64invoicepdf: string;
}

/**
 * Respuesta cuando el documento ya fue enviado anteriormente
 */
export interface InvoiceDuplicateResponseDto {
  success: false;
  message: string;
  customer: any;
  cufe: string;
  sale: number;
}

/**
 * Respuesta cuando el servicio de la DIAN no está disponible
 */
export interface DianUnavailableResponseDto {
  success: false;
  message: string;
}

/**
 * Union type que representa todas las posibles respuestas del endpoint de invoice
 */
export type InvoiceApiResponseDto =
  | InvoiceResponseDto
  | InvoiceErrorResponseDto
  | InvoicePreviewResponseDto
  | InvoiceDuplicateResponseDto
  | DianUnavailableResponseDto; 