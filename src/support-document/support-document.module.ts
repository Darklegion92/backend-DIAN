import { Module } from '@nestjs/common';
import { ProcessSupportDocumentUseCase } from './application/use-cases/process-support-document.use-case';

@Module({
  providers: [
    ProcessSupportDocumentUseCase
  ],
  exports: [
    ProcessSupportDocumentUseCase
  ]
})
export class SupportDocumentModule {} 