import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { getTypeOrmConfig } from '@/common/infrastructure/config/database/typeorm.config';
import { RateLimitService } from '@/common/infrastructure/services/rate-limit.service';
import { DatabaseUtilsService } from '@/common/infrastructure/services/database-utils.service';
import { RateLimitInterceptor } from '@/common/infrastructure/interceptors/rate-limit.interceptor';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { GenerateDataService } from './infrastructure/services/generate-data.service';
import { MailService } from './infrastructure/services/mail.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [NestConfigModule],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
      inject: [ConfigService],
    }),
    HttpModule,
    JwtModule.registerAsync({
      imports: [NestConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '24h'
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    RateLimitService,
    DatabaseUtilsService,
    GenerateDataService,
    MailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [
    HttpModule,
    NestConfigModule,
    JwtModule,
    RateLimitService,
    DatabaseUtilsService,
    GenerateDataService,
    MailService,
  ],
})
export class CommonModule {} 