import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';

import { join } from 'path';

import { getTypeOrmConfig } from './common/infrastructure/config/database/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CompaniesModule } from './company/companies.module';
import { ResolutionsModule } from './resolutions/resolutions.module';
import { SoftwareModule } from './software/software.module';
import { CatalogModule } from './catalog/catalog.module';
import { CertificatesModule } from './certificates/certificates.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CreditNoteModule } from './credit-note/credit-note.module';
import { SupportDocumentModule } from './support-document/support-document.module';
import { ReceivedDocumentModule } from './received-document/received-document.module';
import { DocumentModule } from './document/document.module';
import { SystemModule } from './system/system.module';
import { PayrollModule } from './payroll/payroll.module';
import { DianSoapModule } from './dian-soap/dian-soap.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    CommonModule,
    CatalogModule,
    CertificatesModule,
    CompaniesModule,
    ResolutionsModule,
    SoftwareModule,
    InvoiceModule,
    CreditNoteModule,
    SupportDocumentModule,
    ReceivedDocumentModule,
    DocumentModule,
    SystemModule,
    PayrollModule,
    DianSoapModule,
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [NestConfigModule],
      useFactory: (configService) => getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
