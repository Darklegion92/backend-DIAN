import { Module } from '@nestjs/common';
import { DianSoapService } from './infrastructure/services/dian-soap.service';
import { InvoiceTransformerService } from './infrastructure/services/transformers/invoice-transformer.service';
import { CreditNoteTransformerService } from './infrastructure/services/transformers/credit-note-transformer.service';
import { DocumentTransformerFactory } from './infrastructure/services/transformers/document-transformer.factory';
import { CatalogModule } from '@/catalog/catalog.module';
import { CompaniesModule } from '@/company/companies.module';
import { ResolutionsModule } from '@/resolutions/resolutions.module';

@Module({
  imports: [
    CatalogModule,
    CompaniesModule,
    ResolutionsModule
  ],
  providers: [
    DianSoapService,
    InvoiceTransformerService,
    CreditNoteTransformerService,
    DocumentTransformerFactory
  ],
  exports: [DianSoapService]
})
export class DianSoapModule {} 