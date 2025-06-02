import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseMigrationService {
  private readonly logger = new Logger(DatabaseMigrationService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async checkAndFixUserTable(): Promise<void> {
    try {
      this.logger.log('=== INICIANDO VERIFICACIÓN DE TABLA USERS_SOLTEC ===');

      // Verificar si la tabla users_soltec existe
      const tableExists = await this.checkTableExists('users_soltec');
      
      if (!tableExists) {
        this.logger.log('❌ Tabla users_soltec NO EXISTE - Creando nueva tabla...');
        await this.createUserTable();
        this.logger.log('✅ Tabla users_soltec creada exitosamente');
      } else {
        this.logger.log('✅ Tabla users_soltec EXISTE - Verificando columnas...');
        await this.checkAndFixColumns();
      }

      this.logger.log('=== VERIFICACIÓN COMPLETADA ===');
    } catch (error) {
      this.logger.error('❌ ERROR en verificación de tabla:', error.message);
      this.logger.error('Stack trace:', error.stack);
      throw error;
    }
  }

  private async checkTableExists(tableName: string): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      const result = await queryRunner.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = ?
      `, [tableName]);
      
      const exists = result[0].count > 0;
      this.logger.log(`Tabla ${tableName} existe: ${exists}`);
      return exists;
    } finally {
      await queryRunner.release();
    }
  }

  private async createUserTable(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      await queryRunner.query(`
        CREATE TABLE users_soltec (
          id VARCHAR(36) NOT NULL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          role ENUM('ADMIN', 'DEALER', 'USER') NOT NULL DEFAULT 'USER',
          name VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      this.logger.log('✅ Tabla users_soltec creada con estructura completa');
    } catch (error) {
      this.logger.error('❌ Error creando tabla users_soltec:', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async checkAndFixColumns(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    
    try {
      // Verificar estructura de columnas
      const columns = await queryRunner.query(`DESCRIBE users_soltec`);
      
      this.logger.log('📋 Estructura actual de la tabla:');
      columns.forEach((col: any) => {
        this.logger.log(`  - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });

      // Verificar usuarios existentes
      const userCount = await queryRunner.query(`SELECT COUNT(*) as count FROM users_soltec`);
      this.logger.log(`👥 Usuarios existentes en la tabla: ${userCount[0].count}`);

      // Verificar y agregar columnas faltantes
      await this.addMissingColumn(queryRunner, columns, 'username', 'VARCHAR(255) NOT NULL UNIQUE AFTER id');
      await this.addMissingColumn(queryRunner, columns, 'name', 'VARCHAR(255) NOT NULL');
      await this.addMissingColumn(queryRunner, columns, 'role', "ENUM('ADMIN', 'DEALER', 'USER') NOT NULL DEFAULT 'USER'");

      // Mostrar estructura final
      const finalColumns = await queryRunner.query(`DESCRIBE users_soltec`);
      this.logger.log('✅ Estructura final de la tabla:');
      finalColumns.forEach((col: any) => {
        this.logger.log(`  - ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });

    } catch (error) {
      this.logger.error('❌ Error verificando/corrigiendo columnas:', error.message);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async addMissingColumn(
    queryRunner: any, 
    existingColumns: any[], 
    columnName: string, 
    columnDefinition: string
  ): Promise<void> {
    const columnExists = existingColumns.find((col: any) => col.Field === columnName);
    
    if (!columnExists) {
      this.logger.log(`➕ Agregando columna faltante: ${columnName}`);
      try {
        // Si hay usuarios existentes y es una columna NOT NULL, necesitamos ser más cuidadosos
        const userCount = await queryRunner.query(`SELECT COUNT(*) as count FROM users_soltec`);
        
        if (userCount[0].count > 0 && columnDefinition.includes('NOT NULL') && !columnDefinition.includes('DEFAULT')) {
          // Para columnas NOT NULL sin default en tablas con datos, primero agregamos como NULL
          const nullableDefinition = columnDefinition.replace('NOT NULL', 'NULL');
          await queryRunner.query(`ALTER TABLE users_soltec ADD COLUMN ${columnName} ${nullableDefinition}`);
          
          // Actualizar con valores por defecto según el tipo de columna
          if (columnName === 'username') {
            await queryRunner.query(`UPDATE users_soltec SET username = CONCAT('user_', id) WHERE username IS NULL`);
          } else if (columnName === 'name') {
            await queryRunner.query(`UPDATE users_soltec SET name = 'Usuario Sin Nombre' WHERE name IS NULL`);
          }
          
          // Ahora hacer NOT NULL
          if (columnDefinition.includes('NOT NULL')) {
            await queryRunner.query(`ALTER TABLE users_soltec MODIFY COLUMN ${columnName} ${columnDefinition.replace('AFTER id', '')}`);
          }
        } else {
          // Tabla vacía o columna con DEFAULT, agregar directamente
          await queryRunner.query(`ALTER TABLE users_soltec ADD COLUMN ${columnName} ${columnDefinition}`);
        }
        
        this.logger.log(`✅ Columna ${columnName} agregada exitosamente`);
      } catch (error) {
        this.logger.error(`❌ Error agregando columna ${columnName}:`, error.message);
        // No lanzar error para permitir que continúe con otras columnas
      }
    } else {
      this.logger.log(`✅ Columna ${columnName} ya existe`);
    }
  }
} 