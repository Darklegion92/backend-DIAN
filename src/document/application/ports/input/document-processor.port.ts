import { SendDocumentElectronicDto } from '@/document/presentation/dtos/document.dto';
import { SendDocumentElectronicResponse } from '@/document/domain/interfaces/document.interface';

/**
 * Puerto de entrada para el procesamiento de documentos electrónicos
 * Cada tipo de documento debe implementar esta interfaz
 */
export interface DocumentProcessorPort {
  /**
   * Procesa un documento electrónico específico
   * @param dto Datos del documento a procesar
   * @returns Respuesta con CUFE, fecha y documento generado
   */
  process(dto: SendDocumentElectronicDto): Promise<SendDocumentElectronicResponse>;
}

/**
 * Información del procesador de documentos
 */
export interface DocumentProcessorInfo {
  readonly documentType: number;
  readonly documentTypeName: string;
  readonly processor: DocumentProcessorPort;
} 