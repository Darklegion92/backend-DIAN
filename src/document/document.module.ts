import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { CommonModule } from '@/common/common.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { InvoiceModule } from '@/invoice/invoice.module';
import { CreditNoteModule } from '@/credit-note/credit-note.module';
import { SupportDocumentModule } from '@/support-document/support-document.module';
import { CompaniesModule } from '@/company/companies.module';

import { DocumentController } from './presentation/controllers/document.controller';
import { DocumentService } from './infrastructure/services/document.service';
import { Document } from './domain/entities/document.entity';
import { DocumentRepository } from '@/invoice/infrastructure/repositories/document.repository';

// Servicios de la nueva arquitectura
import { DocumentProcessorFactory } from './application/services/document-processor.factory';
import { DocumentProcessorRegistryService } from './application/services/document-processor-registry.service';
import { MailProcessor } from './infrastructure/queue/mail.processor';

@Module({
  imports: [
    HttpModule,
    CommonModule,
    CatalogModule,
    TypeOrmModule.forFeature([Document]),
    BullModule.registerQueue({
      name: 'mails_queue',
    }),
    
    // Importar módulos que contienen los casos de uso específicos
    // Usar forwardRef() solo para InvoiceModule que tiene dependencia circular
    forwardRef(() => InvoiceModule),
    CreditNoteModule,
    SupportDocumentModule,
    CompaniesModule
  ],
  controllers: [DocumentController],
  providers: [
    DocumentService,
    DocumentRepository,
    
    
    // Servicios de la nueva arquitectura hexagonal
    DocumentProcessorFactory,
    DocumentProcessorRegistryService,
    
    MailProcessor
  ],
  exports: [
    DocumentService,
    DocumentRepository,
    DocumentProcessorFactory
  ]
})
export class DocumentModule {} 