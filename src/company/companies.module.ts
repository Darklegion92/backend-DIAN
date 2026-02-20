import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesController } from '@/company/presentation/controllers/companies.controller';
import { UpdateEnvironmentUseCase } from '@/company/application/use-cases/update-environment.use-case';
import { CompanyEnvironmentService } from '@/company/infrastructure/services/company-environment.service';
import { EXTERNAL_API_SERVICE } from '@/company/domain/services/company-environment.service.interface';
import { CompanyService } from '@/company/application/services/company.service';

import { CommonModule } from '@/common/common.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { ResolutionsModule } from '@/resolutions/resolutions.module';

import { Company } from '@/company/domain/entities/company.entity';
import { Certificate } from '@/certificates/domain/entities/certificate.entity';
import { UserDian } from '@/auth/domain/entities/userDian.entity';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    CommonModule,
    CatalogModule,
    ResolutionsModule,
    TypeOrmModule.forFeature([
      Company,
      Certificate,
      UserDian,
    ]),
  ],
  controllers: [CompaniesController],
  providers: [
    UpdateEnvironmentUseCase,
    CompanyEnvironmentService,
    {
      provide: EXTERNAL_API_SERVICE,
      useClass: CompanyEnvironmentService,
    },
    CompanyService,
  ],
  exports: [
    UpdateEnvironmentUseCase,
    EXTERNAL_API_SERVICE,
    CompanyService,
  ],
})
export class CompaniesModule {} 