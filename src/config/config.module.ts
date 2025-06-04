import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Company } from './domain/entities/company.entity';
import { Certificate } from './domain/entities/certificate.entity';
import { User } from '../auth/domain/entities/user.entity';
import { UserDian } from './domain/entities/userDian.entity';
import { Country } from './domain/entities/country.entity';
import { Department } from './domain/entities/department.entity';
import { Municipality } from './domain/entities/municipality.entity';
import { TypeDocumentIdentification } from './domain/entities/type-document-identification.entity';
import { TypeOrganization } from './domain/entities/type-organization.entity';
import { TypeRegime } from './domain/entities/type-regime.entity';
import { TypeLiability } from './domain/entities/type-liability.entity';
import { PaymentForm } from './domain/entities/payment-form.entity';
import { PaymentMethod } from './domain/entities/payment-method.entity';
import { UnitMeasure } from './domain/entities/unit-measure.entity';
import { TypeCurrency } from './domain/entities/type-currency.entity';
import { Event } from './domain/entities/event.entity';
import { Resolution } from './domain/entities/resolution.entity';
import { Software } from './domain/entities/software.entity';
import { TypeDocument } from '../document/domain/entities/type-document.entity';
import { Tax } from './domain/entities/tax.entity';
import { TypeItemIdentification } from './domain/entities/type-item-identification.entity';
import { CompanyService } from './application/services/company.service';
import { CatalogService } from './application/services/catalog.service';
import { CatalogController } from './infrastructure/controllers/catalog.controller';
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
      UserDian,
      Country,
      Department,
      Municipality,
      TypeDocumentIdentification,
      TypeOrganization,
      TypeRegime,
      TypeLiability,
      PaymentForm,
      PaymentMethod,
      UnitMeasure,
      TypeCurrency,
      Event,
      Resolution,
      Software,
      TypeDocument,
      Tax,
      TypeItemIdentification,
    ]),
    HttpModule,
    NestConfigModule,
    JwtModule,
  ],
  controllers: [
    CatalogController,
    SoftwareController,
    CertificateController,
    ResolutionController,
  ],
  providers: [
    CompanyService,
    CatalogService,
    SoftwareService,
    CertificateService,
    ResolutionService,
  ],
  exports: [
    CompanyService,
    CatalogService,
    SoftwareService,
    CertificateService,
    ResolutionService,
  ],
})
export class ConfigModule {} 