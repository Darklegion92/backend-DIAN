import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InvoiceService } from '@/invoice/infrastructure/services/invoice.service';
import { CommonModule } from '@/common/common.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { DocumentModule } from '@/document/document.module';
import { CompaniesModule } from '@/company/companies.module';
import { InvoiceController } from './presentation/controllers/invoice.controller';
import { ProcessInvoiceUseCase } from './application/use-cases/process-invoice.use-case';
import { ProcessInvoiceContingencyUseCase } from './application/use-cases/process-invoice-contingency.use-case';

@Module({
  imports: [
    HttpModule,
    CommonModule,
    CatalogModule,
    CompaniesModule,
    forwardRef(() => DocumentModule)
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    ProcessInvoiceUseCase,
    ProcessInvoiceContingencyUseCase
  ],
  exports: [
    InvoiceService,
    ProcessInvoiceUseCase,
    ProcessInvoiceContingencyUseCase
  ]
})
export class InvoiceModule {} 