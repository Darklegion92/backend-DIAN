import { ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from '@/common/infrastructure/config/database/typeorm.config';

describe('TypeORM Config', () => {
  let configService: ConfigService;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        const config = {
          DB_HOST: 'localhost',
          DB_PORT: 3306,
          DB_USERNAME: 'test_user',
          DB_PASSWORD: 'test_password',
          DB_DATABASE: 'test_db',
          NODE_ENV: 'development',
        };
        return config[key];
      }),
    } as any;
  });

  it('debería generar la configuración correcta de TypeORM', () => {
    const config = getTypeOrmConfig(configService);

    expect(config).toEqual(expect.objectContaining({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'test_user',
      password: 'test_password',
      database: 'test_db',
      extra: {
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
      logging: true,
    }));
  });

  it('debería deshabilitar el logging en producción', () => {
    const productionConfigService = {
      get: jest.fn((key: string) => {
        const config = {
          DB_HOST: 'localhost',
          DB_PORT: 3306,
          DB_USERNAME: 'test_user',
          DB_PASSWORD: 'test_password',
          DB_DATABASE: 'test_db',
          NODE_ENV: 'production',
        };
        return config[key];
      }),
    } as any;

    const config = getTypeOrmConfig(productionConfigService);

    expect(config.logging).toBe(false);
  });

  it('debería mantener la configuración de charset y collation', () => {
    const config = getTypeOrmConfig(configService);

    expect(config.extra.charset).toBe('utf8mb4');
    expect(config.extra.collation).toBe('utf8mb4_unicode_ci');
  });

  it('debería mantener la configuración de timeouts y límites', () => {
    const config = getTypeOrmConfig(configService);

    expect(config.extra.connectionLimit).toBe(10);
    expect(config.extra.acquireTimeout).toBe(60000);
    expect(config.extra.timeout).toBe(60000);
  });

  it('debería mantener la configuración de entidades y sincronización', () => {
    const config = getTypeOrmConfig(configService);

    expect(config.entities).toEqual(['dist/**/*.entity{.ts,.js}']);
    expect(config.synchronize).toBe(false);
    expect(config.autoLoadEntities).toBe(true);
  });

  it('debería manejar valores undefined del ConfigService', () => {
    const undefinedConfigService = {
      get: jest.fn().mockReturnValue(undefined),
    } as any;

    const config = getTypeOrmConfig(undefinedConfigService);

    expect(config).toEqual(expect.objectContaining({
      type: 'mysql',
      host: undefined,
      port: undefined,
      username: undefined,
      password: undefined,
      database: undefined,
      extra: {
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
      },
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: false,
      autoLoadEntities: true,
      logging: false,
    }));
  });
}); 