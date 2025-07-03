export enum DocumentType {
  INVOICE = 1,
  INVOICE_CONTINGENCY = 3,
  CREDIT_NOTE = 4,
  SUPPORT_DOCUMENT = 11,
  CREDIT_NOTE_DOCUMENT_SUPPORT = 13
}

export const DocumentTypeLabels = {
  [DocumentType.INVOICE]: 'Invoice',
  [DocumentType.INVOICE_CONTINGENCY]: 'Invoice Contingency',
  [DocumentType.CREDIT_NOTE]: 'Credit Note',
  [DocumentType.SUPPORT_DOCUMENT]: 'Support Document',
  [DocumentType.CREDIT_NOTE_DOCUMENT_SUPPORT]: 'Credit Note Document Support'
};

export const VALID_DOCUMENT_TYPES = [
  DocumentType.INVOICE,
  DocumentType.INVOICE_CONTINGENCY,
  DocumentType.CREDIT_NOTE,
  DocumentType.SUPPORT_DOCUMENT,
  DocumentType.CREDIT_NOTE_DOCUMENT_SUPPORT
]; 