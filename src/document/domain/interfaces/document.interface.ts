import { ApiProperty } from '@nestjs/swagger';



export interface SendDocumentElectronicRequest {
  token_dian: string;
  header: string;
  detail: string;
  taxes: string;
  discount: string;
  payment: string;
  customer: string;
  resolutionNumber: string;
  nit: string;
  type_document_id: number;
}

export interface SendDocumentElectronicResponse {
  success: boolean;
  message: string;
  data: {
    date: string;
    cufe: string;
    document: string;
  };
}

export interface SendDocumentElectronicData {
  cufe: string;
  prefix: string;
  number: string;
  date: string;
  document: string;
}