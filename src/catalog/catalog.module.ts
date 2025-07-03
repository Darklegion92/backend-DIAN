import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Presentation Layer
import { CatalogController } from './presentation/controllers/catalog.controller';

// Application Layer  
import { CatalogService } from './application/services/catalog.service';

// Domain Entities
import { TypeDocumentIdentification } from './domain/entities/type-document-identification.entity';
import { TypeOrganization } from './domain/entities/type-organization.entity';
import { TypeRegime } from './domain/entities/type-regime.entity';
import { TypeLiability } from './domain/entities/type-liability.entity';
import { Municipality } from './domain/entities/municipality.entity';
import { UnitMeasure } from './domain/entities/unit-measure.entity';
import { Tax } from './domain/entities/tax.entity';
import { TypeItemIdentification } from './domain/entities/type-item-identification.entity';
import { TypeDocument } from './domain/entities/type-document.entity';
import { PaymentForm } from './domain/entities/payment-form.entity';
import { PaymentMethod } from './domain/entities/payment-method.entity';
import { TypeOperation } from './domain/entities/type-operation.entity';
import { Discount } from './domain/entities/discount.entity';
import { Country } from './domain/entities/country.entity';
import { Department } from './domain/entities/department.entity';
import { Language } from './domain/entities/language.entity';
import { TypeCurrency } from './domain/entities/type-currency.entity';
import { TypeEnvironment } from './domain/entities/type-environment.entity';
import { TypeContract } from './domain/entities/type-contract.entity';
import { TypeWorker } from './domain/entities/type-worker.entity';
import { PayrollPeriod } from './domain/entities/payroll-period.entity';
import { PayrollTypeDocumentIdentification } from './domain/entities/payroll-type-document-identification.entity';
import { TypeRejection } from './domain/entities/type-rejection.entity';
import { TypeDiscount } from './domain/entities/type-discount.entity';
import { Event } from './domain/entities/event.entity';
import { Log } from './domain/entities/log.entity';
import { TypePlan } from './domain/entities/type-plan.entity';
import { Administrator } from './domain/entities/administrator.entity';
import { Send } from './domain/entities/send.entity';
import { Customer } from './domain/entities/customer.entity';
import { Employee } from './domain/entities/employee.entity';
import { DocumentPayroll } from './domain/entities/document-payroll.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      // Catálogos principales
      TypeDocumentIdentification,
      TypeOrganization,
      TypeRegime,
      TypeLiability,
      Municipality,
      UnitMeasure,
      Tax,
      TypeItemIdentification,
      TypeDocument,
      PaymentForm,
      PaymentMethod,
      TypeOperation,
      Discount,
      
      // Catálogos geográficos y adicionales
      Country,
      Department,
      Language,
      TypeCurrency,
      TypeEnvironment,
      TypeContract,
      TypeWorker,
      PayrollPeriod,
      PayrollTypeDocumentIdentification,
      TypeRejection,
      TypeDiscount,
      Event,
      Log,
      TypePlan,
      
      // Entidades de negocio relacionadas
      Administrator,
      Send,
      Customer,
      Employee,
      DocumentPayroll,
    ]),
  ],
  controllers: [
    CatalogController
  ],
  providers: [
    CatalogService
  ],
  exports: [
    CatalogService
  ],
})
export class CatalogModule {} 