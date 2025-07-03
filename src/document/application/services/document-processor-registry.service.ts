import { Injectable, OnModuleInit } from '@nestjs/common';
import { DocumentProcessorFactory } from './document-processor.factory';
import { DocumentType, DocumentTypeLabels } from '@/document/domain/enums/document-type.enum';

// Importar casos de uso de cada módulo
import { ProcessInvoiceUseCase } from '@/invoice/application/use-cases/process-invoice.use-case';
import { ProcessInvoiceContingencyUseCase } from '@/invoice/application/use-cases/process-invoice-contingency.use-case';
import { ProcessCreditNoteUseCase } from '@/credit-note/application/use-cases/process-credit-note.use-case';
import { ProcessCreditNoteDocumentSupportUseCase } from '@/credit-note/application/use-cases/process-credit-note-document-support.use-case';
import { ProcessSupportDocumentUseCase } from '@/support-document/application/use-cases/process-support-document.use-case';

/**
 * Servicio que registra todos los procesadores de documentos en el factory
 * Implementa el patrón Registry + Factory
 */
@Injectable()
export class DocumentProcessorRegistryService implements OnModuleInit {
  constructor(
    private readonly documentProcessorFactory: DocumentProcessorFactory,
    
    // Inyección de todos los casos de uso
    private readonly processInvoiceUseCase: ProcessInvoiceUseCase,
    private readonly processInvoiceContingencyUseCase: ProcessInvoiceContingencyUseCase,
    private readonly processCreditNoteUseCase: ProcessCreditNoteUseCase,
    private readonly processCreditNoteDocumentSupportUseCase: ProcessCreditNoteDocumentSupportUseCase,
    private readonly processSupportDocumentUseCase: ProcessSupportDocumentUseCase,
  ) {}

  /**
   * Registra todos los procesadores cuando el módulo se inicializa
   */
  onModuleInit() {
    this.registerAllProcessors();
  }

  /**
   * Registra todos los procesadores de documentos
   */
  private registerAllProcessors(): void {
    // Registrar procesador para facturas (Tipo 1)
    this.documentProcessorFactory.registerProcessor({
      documentType: DocumentType.INVOICE,
      documentTypeName: DocumentTypeLabels[DocumentType.INVOICE],
      processor: this.processInvoiceUseCase
    });

    // Registrar procesador para facturas de contingencia (Tipo 3)
    this.documentProcessorFactory.registerProcessor({
      documentType: DocumentType.INVOICE_CONTINGENCY,
      documentTypeName: DocumentTypeLabels[DocumentType.INVOICE_CONTINGENCY],
      processor: this.processInvoiceContingencyUseCase
    });

    // Registrar procesador para notas crédito (Tipo 4)
    this.documentProcessorFactory.registerProcessor({
      documentType: DocumentType.CREDIT_NOTE,
      documentTypeName: DocumentTypeLabels[DocumentType.CREDIT_NOTE],
      processor: this.processCreditNoteUseCase
    });

    // Registrar procesador para documentos soporte (Tipo 11)
    this.documentProcessorFactory.registerProcessor({
      documentType: DocumentType.SUPPORT_DOCUMENT,
      documentTypeName: DocumentTypeLabels[DocumentType.SUPPORT_DOCUMENT],
      processor: this.processSupportDocumentUseCase
    });

    // Registrar procesador para notas crédito de documento soporte (Tipo 13)
    this.documentProcessorFactory.registerProcessor({
      documentType: DocumentType.CREDIT_NOTE_DOCUMENT_SUPPORT,
      documentTypeName: DocumentTypeLabels[DocumentType.CREDIT_NOTE_DOCUMENT_SUPPORT],
      processor: this.processCreditNoteDocumentSupportUseCase
    });

    console.log('✅ Todos los procesadores de documentos han sido registrados exitosamente');
    console.log(`📋 Procesadores disponibles:`, this.documentProcessorFactory.getRegisteredProcessors().map(p => 
      `${p.documentType} - ${p.documentTypeName}`
    ));
  }
} 