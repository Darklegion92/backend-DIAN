import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { InvoiceModule } from './invoice/invoice.module';
import { DocumentModule } from './document/document.module';
import { CompaniesModule } from './companies/companies.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    ConfigModule,
    InvoiceModule,
    DocumentModule,
    CompaniesModule,
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [NestConfigModule],
      useFactory: (configService) => getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    SharedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
