import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

// Infrastructure
import { InvoiceController } from './infrastructure/controllers/invoice.controller';
import { InvoiceRepository } from './infrastructure/repositories/invoice.repository';

// Application
import { CreateInvoiceUseCase } from './application/use-cases/create-invoice.use-case';
import { GetInvoiceStatusUseCase } from './application/use-cases/get-invoice-status.use-case';

// Domain
import { INVOICE_REPOSITORY } from './domain/repositories/invoice.repository.interface';

@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
    ConfigModule,
  ],
  controllers: [InvoiceController],
  providers: [
    // Use Cases
    CreateInvoiceUseCase,
    GetInvoiceStatusUseCase,
    
    // Repositories
    InvoiceRepository,
    {
      provide: INVOICE_REPOSITORY,
      useClass: InvoiceRepository,
    },
  ],
  exports: [
    CreateInvoiceUseCase,
    GetInvoiceStatusUseCase,
    INVOICE_REPOSITORY,
  ],
})
export class InvoiceModule {} 