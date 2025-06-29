import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CompaniesController } from './infrastructure/controllers/companies.controller';
import { UpdateEnvironmentUseCase } from './application/use-cases/update-environment.use-case';
import { ExternalApiService } from './infrastructure/services/external-api.service';
import { EXTERNAL_API_SERVICE } from './domain/services/external-api.service.interface';
import { CompanyService } from '../config/application/services/company.service';
import { ConfigModule as ConfigModuleConfig } from '../config/config.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule,
    ConfigModuleConfig,
  ],
  controllers: [CompaniesController],
  providers: [
    UpdateEnvironmentUseCase,
    ExternalApiService,
    {
      provide: EXTERNAL_API_SERVICE,
      useClass: ExternalApiService,
    },
  ],
  exports: [
    UpdateEnvironmentUseCase,
    EXTERNAL_API_SERVICE,
  ],
})
export class CompaniesModule {} 