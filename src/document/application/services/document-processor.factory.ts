import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentProcessorPort, DocumentProcessorInfo } from '../ports/input/document-processor.port';
import { DocumentType, DocumentTypeLabels } from '@/document/domain/enums/document-type.enum';

/**
 * Factory para seleccionar el procesador de documentos correcto
 * Implementa patrón Strategy + Factory
 */
@Injectable()
export class DocumentProcessorFactory {
  private readonly processors = new Map<number, DocumentProcessorInfo>();

  /**
   * Registra un procesador para un tipo de documento específico
   */
  registerProcessor(processorInfo: DocumentProcessorInfo): void {
    this.processors.set(processorInfo.documentType, processorInfo);
  }

  /**
   * Obtiene el procesador para un tipo de documento específico
   */
  getProcessor(documentType: number): DocumentProcessorPort {
    const processorInfo = this.processors.get(documentType);
    
    if (!processorInfo) {
      throw new HttpException(
        {
          success: false,
          message: 'Tipo de documento no soportado',
          error: `No existe procesador para el tipo de documento ${documentType}. Tipos válidos: ${Array.from(this.processors.keys()).join(', ')}`
        },
        HttpStatus.BAD_REQUEST
      );
    }

    return processorInfo.processor;
  }

  /**
   * Obtiene información de todos los procesadores registrados
   */
  getRegisteredProcessors(): DocumentProcessorInfo[] {
    return Array.from(this.processors.values());
  }

  /**
   * Verifica si un tipo de documento está soportado
   */
  isDocumentTypeSupported(documentType: number): boolean {
    return this.processors.has(documentType);
  }

  /**
   * Obtiene el nombre del tipo de documento
   */
  getDocumentTypeName(documentType: number): string {
    return DocumentTypeLabels[documentType as DocumentType] || `Unknown Type ${documentType}`;
  }
} 