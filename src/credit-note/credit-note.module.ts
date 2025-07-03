import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ProcessCreditNoteUseCase } from './application/use-cases/process-credit-note.use-case';
import { ProcessCreditNoteDocumentSupportUseCase } from './application/use-cases/process-credit-note-document-support.use-case';
import { CompaniesModule } from '@/company/companies.module';

@Module({
  controllers: [],
  providers: [
    ProcessCreditNoteUseCase,
    ProcessCreditNoteDocumentSupportUseCase
  ],
  imports: [
    HttpModule,
    ConfigModule,
    CompaniesModule
  ],
  exports: [
    ProcessCreditNoteUseCase,
    ProcessCreditNoteDocumentSupportUseCase
  ]
})
export class CreditNoteModule {} 