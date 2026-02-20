/**
 * Resultado de un documento (factura o nota crédito) enviado en el proceso de prueba.
 */
export interface TestDocumentResult {
  index: number;
  number: string | number;
  accepted: boolean;
  cufe?: string;
  error?: string;
}

/**
 * Respuesta del endpoint de generación de facturas y notas crédito de prueba.
 * Se envían 5 facturas y 5 notas crédito (10 documentos). allAccepted es true solo si los 10 fueron aceptados.
 */
export interface GenerateTestInvoiceResult {
  allAccepted: boolean;
  totalDocuments: number;
  acceptedCount: number;
  invoices: TestDocumentResult[];
  creditNotes: TestDocumentResult[];
  message: string;
}
