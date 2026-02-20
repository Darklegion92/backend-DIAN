import { CreateResolutionDto } from '@/resolutions/presentation/dtos/create-resolution.dto';

/**
 * Datos quemados de resolución de factura electrónica para pruebas o uso en el módulo company.
 */
export const TEST_RESOLUTION_INVOICE_DATA: CreateResolutionDto = {
  prefix: "SETP",
  type_document_id: 1,
  resolution: '18760000001',
  bearerToken: '',
  company_id: 0
}


/**
 * Datos quemados de resolución de nota crédito electrónica para pruebas o uso en el módulo company.
 */
export const TEST_CREDIT_NOTE_RESOLUTION_DATA: CreateResolutionDto = {
  prefix: "NC",
  type_document_id: 4,
  resolution: '1',
  bearerToken: '',
  company_id: 0
}


