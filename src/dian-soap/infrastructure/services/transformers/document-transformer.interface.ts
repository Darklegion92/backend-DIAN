import { FacturaGeneralDto } from '../../../presentation/dtos/request/factura-general.dto';

/**
 * Interfaz base para los transformadores de documentos
 */
export interface DocumentTransformer<T> {
  /**
   * Transforma una factura general en el tipo específico de documento
   * @param factura Factura general del request SOAP
   * @returns Documento transformado al formato específico
   */
  transform(factura: FacturaGeneralDto, companyId: number): Promise<T>;
} 