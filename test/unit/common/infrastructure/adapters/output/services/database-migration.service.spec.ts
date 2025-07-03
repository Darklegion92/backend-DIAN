import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseMigrationService } from '@/common/infrastructure/adapters/output/services/database-migration.service';
import { DataSource } from 'typeorm';

describe('DatabaseMigrationService', () => {
  let service: DatabaseMigrationService;
  let dataSource: DataSource;
  let queryRunner: any;

  const mockQueryRunner = {
    query: jest.fn(),
    release: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseMigrationService,
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<DatabaseMigrationService>(DatabaseMigrationService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = mockQueryRunner;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkAndFixUserTable', () => {
    it('debería crear la tabla si no existe', async () => {
      // Mock para verificar que la tabla no existe
      queryRunner.query.mockResolvedValueOnce([{ count: 0 }]);
      
      // Mock para la creación de la tabla
      queryRunner.query.mockResolvedValueOnce(undefined);

      await service.checkAndFixUserTable();

      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) as count'),
        ['users_soltec']
      );
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('CREATE TABLE users_soltec')
      );
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('debería verificar columnas si la tabla existe', async () => {
      // Configurar el mock para responder según la consulta
      queryRunner.query.mockImplementation((query: string) => {
        if (query.includes('SELECT COUNT(*) as count')) {
          return Promise.resolve([{ count: 1 }]);
        }
        if (query === 'DESCRIBE users_soltec') {
          return Promise.resolve([
            { Field: 'id', Type: 'VARCHAR(36)', Null: 'NO' },
            { Field: 'username', Type: 'VARCHAR(255)', Null: 'NO' },
            { Field: 'name', Type: 'VARCHAR(255)', Null: 'NO' },
            { Field: 'role', Type: "ENUM('ADMIN', 'DEALER', 'USER')", Null: 'NO' },
            { Field: 'password', Type: 'VARCHAR(255)', Null: 'NO' },
            { Field: 'email', Type: 'VARCHAR(255)', Null: 'NO' },
            { Field: 'createdAt', Type: 'TIMESTAMP', Null: 'YES' },
            { Field: 'updatedAt', Type: 'TIMESTAMP', Null: 'YES' },
          ]);
        }
        if (query.includes('SELECT COUNT(*) FROM users_soltec')) {
          return Promise.resolve([{ count: 0 }]);
        }
        if (query.includes('ALTER TABLE users_soltec')) {
          return Promise.resolve(undefined);
        }
        return Promise.resolve([]);
      });

      await service.checkAndFixUserTable();

      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) as count'),
        ['users_soltec']
      );
      expect(queryRunner.query).toHaveBeenCalledWith('DESCRIBE users_soltec');
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('debería manejar errores durante la verificación', async () => {
      const error = new Error('Error de base de datos');
      queryRunner.query.mockRejectedValueOnce(error);

      await expect(service.checkAndFixUserTable()).rejects.toThrow('Error de base de datos');
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('addMissingColumn', () => {
    it('debería agregar una columna faltante a una tabla vacía', async () => {
      const existingColumns = [
        { Field: 'id', Type: 'VARCHAR(36)', Null: 'NO' },
      ];

      // Mock para contar usuarios (tabla vacía)
      queryRunner.query.mockResolvedValueOnce([{ count: 0 }]);

      // Mock para agregar columna
      queryRunner.query.mockResolvedValueOnce(undefined);

      await service['addMissingColumn'](
        queryRunner,
        existingColumns,
        'username',
        'VARCHAR(255) NOT NULL UNIQUE AFTER id'
      );

      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE users_soltec ADD COLUMN username')
      );
    });

    it('debería manejar la adición de columnas NOT NULL a tablas con datos', async () => {
      const existingColumns = [
        { Field: 'id', Type: 'VARCHAR(36)', Null: 'NO' },
      ];

      // Mock para contar usuarios (tabla con datos)
      queryRunner.query.mockResolvedValueOnce([{ count: 1 }]);

      // Mock para agregar columna como NULL
      queryRunner.query.mockResolvedValueOnce(undefined);

      // Mock para actualizar valores
      queryRunner.query.mockResolvedValueOnce(undefined);

      // Mock para modificar a NOT NULL
      queryRunner.query.mockResolvedValueOnce(undefined);

      await service['addMissingColumn'](
        queryRunner,
        existingColumns,
        'username',
        'VARCHAR(255) NOT NULL UNIQUE AFTER id'
      );

      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE users_soltec ADD COLUMN username VARCHAR(255) NULL')
      );
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users_soltec SET username = CONCAT')
      );
      expect(queryRunner.query).toHaveBeenCalledWith(
        expect.stringContaining('ALTER TABLE users_soltec MODIFY COLUMN username')
      );
    });

    it('debería manejar errores durante la adición de columnas', async () => {
      const existingColumns = [
        { Field: 'id', Type: 'VARCHAR(36)', Null: 'NO' },
      ];

      queryRunner.query.mockRejectedValueOnce(new Error('Error al agregar columna'));

      await service['addMissingColumn'](
        queryRunner,
        existingColumns,
        'username',
        'VARCHAR(255) NOT NULL UNIQUE AFTER id'
      );

      expect(queryRunner.query).toHaveBeenCalled();
    });
  });
}); 