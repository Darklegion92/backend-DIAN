import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { DianSoapService } from './infrastructure/services/dian-soap.service';
import { DocumentTransformerFactory } from './infrastructure/services/transformers/document-transformer.factory';
import { InvoiceTransformerService } from './infrastructure/services/transformers/invoice-transformer.service';
import { CreditNoteTransformerService } from './infrastructure/services/transformers/credit-note-transformer.service';
import { SupportDocumentTransformerService } from './infrastructure/services/transformers/support-document-transformer.service';
import { SupportDocumentCreditNoteTransformerService } from './infrastructure/services/transformers/support-document-credit-note-transformer.service';
import { AdjuntosSoapService } from './infrastructure/services/adjuntos-soap.service';

import { DocumentModule } from '@/document/document.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { ResolutionsModule } from '@/resolutions/resolutions.module';
import { InvoiceModule } from '@/invoice/invoice.module';
import { CommonModule } from '@/common/common.module';
import { CreditNoteModule } from '@/credit-note/credit-note.module';
import { SupportDocumentModule } from '@/support-document/support-document.module';

import { EnviarHandler } from './infrastructure/handlers/enviar.handler';
import { EstadoDocumentoHandler } from './infrastructure/handlers/estado-documento.handler';
import { EnvioCorreoHandler } from './infrastructure/handlers/envio-correo.handler';
import { DescargaPdfHandler } from './infrastructure/handlers/descarga-pdf.handler';
import { CompaniesModule } from '@/company/companies.module';

@Module({
  imports: [
    HttpModule,
    CompaniesModule,
    CatalogModule,
    ResolutionsModule,
    InvoiceModule,
    CreditNoteModule,
    SupportDocumentModule,
    forwardRef(() => DocumentModule),
    CommonModule,
  ],
  controllers: [],
  providers: [
    DianSoapService,
    DocumentTransformerFactory,
    InvoiceTransformerService,
    CreditNoteTransformerService,
    SupportDocumentTransformerService,
    SupportDocumentCreditNoteTransformerService,
    AdjuntosSoapService,
    EnviarHandler,
    EstadoDocumentoHandler,
    EnvioCorreoHandler,
    DescargaPdfHandler,
  ],
  exports: [DianSoapService],
})
export class DianSoapModule {} 