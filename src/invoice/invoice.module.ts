import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ExternalInvoiceService } from './domain/services/external-invoice.service';
import { ConfigModule as AppConfigModule } from '../config/config.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AppConfigModule,
    SharedModule
  ],
  providers: [
    ExternalInvoiceService
  ],
  exports: [
    ExternalInvoiceService
  ]
})
export class InvoiceModule {} 