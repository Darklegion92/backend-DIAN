import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { RolesGuard } from './guards/roles.guard';
import { DealerAccessGuard } from './guards/dealer-access.guard';

@Global()
@Module({
  imports: [
    JwtModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    RolesGuard,
    DealerAccessGuard,
  ],
  exports: [RolesGuard, DealerAccessGuard],
})
export class CommonModule {} 