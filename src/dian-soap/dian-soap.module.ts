import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { DianSoapService } from './infrastructure/services/dian-soap.service';
import { DocumentTransformerFactory } from './infrastructure/services/transformers/document-transformer.factory';
import { InvoiceTransformerService } from './infrastructure/services/transformers/invoice-transformer.service';
import { CreditNoteTransformerService } from './infrastructure/services/transformers/credit-note-transformer.service';
import { AdjuntosSoapService } from './infrastructure/services/adjuntos-soap.service';

import { DocumentModule } from '@/document/document.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { ResolutionsModule } from '@/resolutions/resolutions.module';
import { InvoiceModule } from '@/invoice/invoice.module';
import { CommonModule } from '@/common/common.module';

import { EnviarHandler } from './infrastructure/handlers/enviar.handler';
import { EstadoDocumentoHandler } from './infrastructure/handlers/estado-documento.handler';
import { EnvioCorreoHandler } from './infrastructure/handlers/envio-correo.handler';
import { CompaniesModule } from '@/company/companies.module';

@Module({
  imports: [
    HttpModule,
    CompaniesModule,
    CatalogModule,
    ResolutionsModule,
    InvoiceModule,
    forwardRef(() => DocumentModule),
    CommonModule,
  ],
  controllers: [],
  providers: [
    DianSoapService,
    DocumentTransformerFactory,
    InvoiceTransformerService,
    CreditNoteTransformerService,
    AdjuntosSoapService,
    EnviarHandler,
    EstadoDocumentoHandler,
    EnvioCorreoHandler,
  ],
  exports: [DianSoapService],
})
export class DianSoapModule {} 