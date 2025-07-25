/**
 * Interface para la respuesta de validación de la DIAN
 */
export interface DianValidationResponseDto {
  IsValid?: string;
  StatusCode?: string;
  StatusDescription?: string;
  StatusMessage?: string;
  XmlDocumentKey?: string;
  XmlBase64Bytes?: string;
  XmlFileName?: string;
  ErrorMessage?: string[];
  ProcessedMessage?: string;
}

/**
 * Interface para la estructura completa de respuesta de la DIAN
 */
export interface DianFullResponseDto {
  Envelope?: {
    Body?: {
      SendBillSyncResponse?: {
        SendBillSyncResult?: DianValidationResponseDto;
      };
    };
  };
}

/**
 * Interface para el estado del documento en la DIAN
 */
export interface DocumentStatusDto {
  message?: string;
  ResponseDian?: DianFullResponseDto;
  is_valid?: boolean;
  status_code?: string;
  status_description?: string;
  validation_errors?: string[];
  technical_errors?: string[];
}

/**
 * Interface para información del emisor
 */
export interface IssuerInfoDto {
  identification_number?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

/**
 * Interface para información del cliente/adquiriente
 */
export interface ClientInfoDto {
  identification_number?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  type_document_identification_id?: number;
}

/**
 * Interface principal para respuesta exitosa del endpoint /sd-credit-note
 */
export interface SuccessResponseDto {
  message?:               string;
  send_email_success?:    boolean;
  send_email_date_time?:  boolean;
  ResponseDian?:          ResponseDian;
  invoicexml?:            string;
  zipinvoicexml?:         string;
  unsignedinvoicexml?:    string;
  reqfe?:                 string;
  rptafe?:                string;
  attacheddocument?:      string;
  urlinvoicexml?:         string;
  urlinvoicepdf?:         string;
  urlinvoiceattached?:    string;
  cude?:                  string;
  QRStr?:                 string;
  certificate_days_left?: number;
}

export interface ResponseDian {
  Envelope: Envelope;
}

export interface Envelope {
  Header?: Header;
  Body?:   Body;
}

export interface Body {
  SendBillSyncResponse?: SendBillSyncResponse;
}

export interface SendBillSyncResponse {
  SendBillSyncResult?: SendBillSyncResult;
}

export interface SendBillSyncResult {
  ErrorMessage?:      ErrorMessage;
  IsValid?:           string;
  StatusCode?:        string;
  StatusDescription?: string;
  StatusMessage?:     string;
  XmlBase64Bytes?:    string;
  XmlBytes?:          XMLBytes;
  XmlDocumentKey?:    string;
  XmlFileName?:       string;
}

export interface ErrorMessage {
  string?: string;
  strings?: string[];
}

export interface XMLBytes {
  _attributes?: XMLBytesAttributes;
}

export interface XMLBytesAttributes {
  nil?: string;
}

export interface Header {
  Action?:   Action;
  Security?: Security;
}

export interface Action {
  _attributes?: ActionAttributes;
  _value?:      string;
}

export interface ActionAttributes {
  mustUnderstand?: string;
}

export interface Security {
  _attributes?: ActionAttributes;
  Timestamp?:   Timestamp;
}

export interface Timestamp {
  _attributes?: TimestampAttributes;
  Created?:     Date;
  Expires?:     Date;
}

export interface TimestampAttributes {
  Id?: string;
}

export interface SdCreditNoteSuccessResponseDto extends SuccessResponseDto {
  cufe?: string;
}

export interface CreditNoteSuccessResponseDto extends SuccessResponseDto {
}


/**
 * Interface para errores de validación de datos
 */
export interface ValidationErrorDto {
  field: string;
  message: string;
  code?: string;
  value?: any;
}

/**
 * Interface para errores de la DIAN
 */
export interface DianErrorDto {
  error_code: string;
  error_message: string;
  error_type: 'VALIDATION' | 'TECHNICAL' | 'BUSINESS' | 'COMMUNICATION';
  details?: string;
  dian_response?: DianValidationResponseDto;
}

/**
 * Interface para errores del sistema/aplicación
 */
export interface SystemErrorDto {
  error_type: 'DATABASE' | 'NETWORK' | 'CERTIFICATE' | 'CONFIGURATION' | 'INTERNAL';
  error_code: string;
  error_message: string;
  stack_trace?: string;
  timestamp: string;
}

/**
 * Interface para respuesta de error del endpoint /sd-credit-note
 */
export interface ErrorResponseDto {
  success: false;
  message: string;
  
  // Tipo de error principal
  error_type: 'VALIDATION' | 'DIAN' | 'SYSTEM' | 'BUSINESS';
  
  // Código de error específico
  error_code: string;
  
  // Detalles del error
  validation_errors?: ValidationErrorDto[];
  dian_errors?: DianErrorDto[];
  system_errors?: SystemErrorDto[];
  
  // Información de contexto
  request_id?: string;
  timestamp: string;
  
  // Información para reintento
  retry_after?: number;
  max_retries?: number;
  current_attempt?: number;
}

export interface SdCreditNoteErrorResponseDto extends ErrorResponseDto {
  partial_data?: SdCreditNotePartialDataDto;
}

export interface CreditNoteErrorResponseDto extends ErrorResponseDto {
  partial_data?: CreditNotePartialDataDto;
}


export interface SdCreditNotePartialDataDto extends PartialDataDto {
  cufe?: string;
}

export interface CreditNotePartialDataDto extends PartialDataDto {
  cude?: string;
}

export interface PartialDataDto {
  uuid?: string;
  xml_generated?: boolean;
  pdf_generated?: boolean;
}

/**
 * Union type para cualquier respuesta del endpoint /sd-credit-note
 */
export type SdCreditNoteResponseDto = SdCreditNoteSuccessResponseDto;

export type CreditNoteResponseDto = CreditNoteSuccessResponseDto | CreditNoteErrorResponseDto;

/**
 * Interface para validar el tipo de respuesta
 */
export interface SdCreditNoteResponseValidator {
  isSuccess(response: SdCreditNoteResponseDto): response is SdCreditNoteSuccessResponseDto;
  isError(response: SdCreditNoteResponseDto): response is SdCreditNoteErrorResponseDto;
  hasValidationErrors(response: SdCreditNoteResponseDto): boolean;
  hasDianErrors(response: SdCreditNoteResponseDto): boolean;
  hasSystemErrors(response: SdCreditNoteResponseDto): boolean;
}

/**
 * Enum para tipos de errores comunes
 */
export enum SdCreditNoteErrorType {
  // Errores de validación
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT = 'INVALID_FORMAT',
  INVALID_VALUE = 'INVALID_VALUE',
  DUPLICATE_DOCUMENT = 'DUPLICATE_DOCUMENT',
  
  // Errores de negocio
  BILLING_REFERENCE_NOT_FOUND = 'BILLING_REFERENCE_NOT_FOUND',
  INVALID_DOCUMENT_STATE = 'INVALID_DOCUMENT_STATE',
  CREDIT_NOTE_EXCEEDS_ORIGINAL = 'CREDIT_NOTE_EXCEEDS_ORIGINAL',
  INVALID_SELLER_CREDENTIALS = 'INVALID_SELLER_CREDENTIALS',
  
  // Errores de la DIAN
  DIAN_SERVICE_UNAVAILABLE = 'DIAN_SERVICE_UNAVAILABLE',
  DIAN_AUTHENTICATION_FAILED = 'DIAN_AUTHENTICATION_FAILED',
  DIAN_VALIDATION_FAILED = 'DIAN_VALIDATION_FAILED',
  CERTIFICATE_EXPIRED = 'CERTIFICATE_EXPIRED',
  CERTIFICATE_INVALID = 'CERTIFICATE_INVALID',
  
  // Errores del sistema
  DATABASE_CONNECTION_FAILED = 'DATABASE_CONNECTION_FAILED',
  NETWORK_TIMEOUT = 'NETWORK_TIMEOUT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  
  // Errores de archivos
  PDF_GENERATION_FAILED = 'PDF_GENERATION_FAILED',
  XML_GENERATION_FAILED = 'XML_GENERATION_FAILED',
  ZIP_CREATION_FAILED = 'ZIP_CREATION_FAILED',
  QR_GENERATION_FAILED = 'QR_GENERATION_FAILED'
}

/**
 * Interface para mapeo de códigos de error a mensajes
 */
export interface ErrorCodeMapping {
  [key: string]: {
    message: string;
    description: string;
    solution?: string;
    http_status: number;
  };
} 