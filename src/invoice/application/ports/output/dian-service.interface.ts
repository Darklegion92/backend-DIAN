export interface DianeTimestamp {
  _attributes: {
    Id: string;
  };
  Created: string;
  Expires: string;
}

export interface DianeHeader {
  Action: {
    _attributes: {
      mustUnderstand: string;
    };
    _value: string;
  };
  Security: {
    _attributes: {
      mustUnderstand: string;
    };
    Timestamp: DianeTimestamp;
  };
}

export interface DianeErrorMessage {
  string?: string;
  strings?: string[];
}

export interface DianeSendBillSyncResult {
  ErrorMessage: DianeErrorMessage;
  IsValid: string;
  StatusCode: string;
  StatusDescription: string;
  StatusMessage: string;
  XmlBase64Bytes: string;
}

export interface DianeSendBillSyncResponse {
  SendBillSyncResult: DianeSendBillSyncResult;
}

export interface DianeBody {
  SendBillSyncResponse: DianeSendBillSyncResponse;
}

export interface DianeEnvelope {
  Header: DianeHeader;
  Body: DianeBody;
}

export interface DianeResponseData {
  Envelope: DianeEnvelope;
}

export interface InvoiceCreationData {
  // Datos específicos de creación de factura
}

export interface CreateInvoiceResponse {
  cufe?: string;
  success?: boolean;
  message?: string;
  data?: InvoiceCreationData;
  send_email_success?: boolean;
  send_email_date_time?: boolean;
  urlinvoicexml?: string;
  urlinvoicepdf?: string;
  urlinvoiceattached?: string;
  QRStr?: string;
  certificate_days_left?: number;
  resolution_days_left?: number;
  ResponseDian?: DianeResponseData;
} 