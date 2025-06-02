import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../auth/domain/entities/user.entity';
import { Company } from '../config/domain/entities/company.entity';
import { Certificate } from '../config/domain/entities/certificate.entity';

/**
 * Configuración de TypeORM para el arranque inicial de la aplicación.
 * Incluye todas las entidades necesarias para lectura/escritura de datos.
 * NO modifica la estructura de tablas existentes (synchronize: false).
 */
export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
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
  // Entidades necesarias para operaciones de lectura/escritura
  entities: [User, Company, Certificate],
  // Sincronización deshabilitada para preservar estructura existente de BD
  synchronize: false,
  // Habilitado para permitir carga automática de entidades de otros módulos
  autoLoadEntities: true,
  logging: configService.get('NODE_ENV') === 'development',
});
