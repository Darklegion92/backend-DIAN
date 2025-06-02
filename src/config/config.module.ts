import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { Company } from './domain/entities/company.entity';
import { Certificate } from './domain/entities/certificate.entity';
import { User } from '../auth/domain/entities/user.entity';
import { Country } from './domain/entities/country.entity';
import { TypeDocumentIdentification } from './domain/entities/type-document-identification.entity';
import { PaymentForm } from './domain/entities/payment-form.entity';
import { UnitMeasure } from './domain/entities/unit-measure.entity';
import { TypeCurrency } from './domain/entities/type-currency.entity';
import { Event } from './domain/entities/event.entity';
import { Resolution } from './domain/entities/resolution.entity';
import { TypeDocument } from '../document/domain/entities/type-document.entity';
import { CompanyService } from './application/services/company.service';
import { CompanyController } from './infrastructure/controllers/company.controller';
import { SoftwareService } from './application/services/software.service';
import { SoftwareController } from './infrastructure/controllers/software.controller';
import { CertificateService } from './application/services/certificate.service';
import { CertificateController } from './infrastructure/controllers/certificate.controller';
import { ResolutionService } from './application/services/resolution.service';
import { ResolutionController } from './infrastructure/controllers/resolution.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      Certificate,
      User,
      Country,
      TypeDocumentIdentification,
      PaymentForm,
      UnitMeasure,
      TypeCurrency,
      Event,
      Resolution,
      TypeDocument,
    ]),
    HttpModule,
    NestConfigModule,
  ],
  controllers: [
    CompanyController,
    SoftwareController,
    CertificateController,
    ResolutionController,
  ],
  providers: [
    CompanyService,
    SoftwareService,
    CertificateService,
    ResolutionService,
  ],
  exports: [
    CompanyService,
    SoftwareService,
    CertificateService,
    ResolutionService,
  ],
})
export class ConfigModule {} 