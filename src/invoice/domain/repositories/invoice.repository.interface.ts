import { Invoice, InvoiceStatus } from '../entities/invoice.entity';

export const INVOICE_REPOSITORY = Symbol('INVOICE_REPOSITORY');

export interface InvoiceRepositoryInterface {
  /**
   * Crear una nueva factura en el sistema externo
   * @param invoiceData Datos de la factura a crear
   * @returns Promise con la factura creada
   */
  create(invoiceData: any): Promise<Invoice>;

  /**
   * Obtener el estado de una factura por su número
   * @param invoiceNumber Número de la factura
   * @returns Promise con el estado de la factura
   */
  getStatus(invoiceNumber: string): Promise<InvoiceStatus>;

  /**
   * Buscar una factura por su número
   * @param invoiceNumber Número de la factura
   * @returns Promise con la factura encontrada o null
   */
  findByNumber(invoiceNumber: string): Promise<Invoice | null>;

  /**
   * Actualizar el estado de una factura
   * @param invoiceNumber Número de la factura
   * @param status Nuevo estado
   * @returns Promise con la factura actualizada
   */
  updateStatus(invoiceNumber: string, status: InvoiceStatus): Promise<Invoice>;
} 