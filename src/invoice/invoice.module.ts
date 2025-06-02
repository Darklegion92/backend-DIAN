import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { InvoiceController } from './infrastructure/controllers/invoice.controller';
import { ExternalInvoiceService } from './domain/services/external-invoice.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
  ],
  controllers: [InvoiceController],
  providers: [ExternalInvoiceService],
  exports: [ExternalInvoiceService],
})
export class InvoiceModule {} 