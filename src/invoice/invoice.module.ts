import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InvoiceController } from './infrastructure/controllers/invoice.controller';
import { ExternalInvoiceService } from './domain/services/external-invoice.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    JwtModule,
  ],
  controllers: [InvoiceController],
  providers: [ExternalInvoiceService],
  exports: [ExternalInvoiceService],
})
export class InvoiceModule {} 