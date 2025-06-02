import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { InvoiceModule } from './invoice/invoice.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CommonModule,
    AuthModule,
    ConfigModule,
    InvoiceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
