import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '@/common/common.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { DocumentModule } from '@/document/document.module';
import { CompaniesModule } from '@/company/companies.module';
import { PayrollController } from './presentation/controllers/payroll.controller';
import { ProcessPayrollService } from './application/services/process-payroll.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeWorker } from '@/catalog/domain/entities/type-worker.entity';
import { TypeContract } from '@/catalog/domain/entities/type-contract.entity';
import { ConfigModule } from '@nestjs/config';

/**
 * Módulo de Nóminas Electrónicas
 * Implementa la arquitectura hexagonal con separación clara de responsabilidades
 * Maneja el procesamiento de nóminas y ajustes de nómina para la DIAN
 */
@Module({
  imports: [
    HttpModule,
    CommonModule,
    CatalogModule,
    CompaniesModule,
    ConfigModule,
    TypeOrmModule.forFeature([TypeWorker, TypeContract]),
    forwardRef(() => DocumentModule)
  ],
  controllers: [
    PayrollController 
  ],
  providers: [
    ProcessPayrollService
  ],
  exports: [
    ProcessPayrollService
  ]
})
export class PayrollModule {} 