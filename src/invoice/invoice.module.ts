import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { InvoiceService } from './domain/services/invoice.service';
import { ConfigModule as AppConfigModule } from '../config/config.module';
import { SharedModule } from '../shared/shared.module';
import { InvoiceController } from './infrastructure/controllers/invoice.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AppConfigModule,
    SharedModule
  ],
  controllers: [InvoiceController],
  providers: [
    InvoiceService
  ],
  exports: [
    InvoiceService
  ]
})
export class InvoiceModule {} 