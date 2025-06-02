import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../auth/domain/entities/user.entity';
import { Company } from './domain/entities/company.entity';
import { Certificate } from './domain/entities/certificate.entity';
import { Country } from './domain/entities/country.entity';
import { TypeDocumentIdentification } from './domain/entities/type-document-identification.entity';
import { PaymentForm } from './domain/entities/payment-form.entity';
import { UnitMeasure } from './domain/entities/unit-measure.entity';
import { TypeCurrency } from './domain/entities/type-currency.entity';
import { Event } from './domain/entities/event.entity';
import { Resolution } from './domain/entities/resolution.entity';
import { TypeDocument } from '../document/domain/entities/type-document.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  charset: 'utf8mb4',
  extra: {
    charset: 'utf8mb4',
    collation: 'utf8mb4_unicode_ci',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
  },
  entities: [
    User,
    Company,
    Certificate,
    Country,
    TypeDocumentIdentification,
    PaymentForm,
    UnitMeasure,
    TypeCurrency,
    Event,
    Resolution,
    TypeDocument,
  ],
  synchronize: false,
  autoLoadEntities: true,
  logging: configService.get('NODE_ENV') === 'development',
}); 