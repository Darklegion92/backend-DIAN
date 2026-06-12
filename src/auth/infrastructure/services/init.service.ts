import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { Role } from '@/auth/domain/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY } from '@/auth/domain/repositories/user.repository.interface';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async onModuleInit() {
    try {
      await this.createUsersSoltecTableIfNotExists();
      await this.createAppVersionsTableIfNotExists();
      await this.checkAndAddCompanyColumns();
      await this.createDefaultAdmin();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error during initialization:', error.message);
      }
    }
  }

  private async checkAndAddCompanyColumns() {
    try {
      this.logger.log('Verificando columnas de la tabla companies...');
      
      const checkColumnSQL = `
        SELECT count(*) as count 
        FROM information_schema.COLUMNS 
        WHERE TABLE_NAME = 'companies' AND COLUMN_NAME = 'soltec_user_id' AND TABLE_SCHEMA = DATABASE()
      `;
      const result = await this.dataSource.query(checkColumnSQL);
      
      if (result[0].count == 0) {
        this.logger.log('Agregando columna soltec_user_id a companies...');
        await this.dataSource.query(`ALTER TABLE companies ADD COLUMN soltec_user_id VARCHAR(50) NULL`);
      }
      
      const checkTokenEmpresaSQL = `
        SELECT count(*) as count 
        FROM information_schema.COLUMNS 
        WHERE TABLE_NAME = 'companies' AND COLUMN_NAME = 'tokenEmpresa' AND TABLE_SCHEMA = DATABASE()
      `;
      const resultToken = await this.dataSource.query(checkTokenEmpresaSQL);
      
      if (resultToken[0].count == 0) {
        this.logger.log('Agregando columnas tokenEmpresa y tokenPassword a companies...');
        await this.dataSource.query(`ALTER TABLE companies ADD COLUMN tokenEmpresa VARCHAR(20) NULL`);
        await this.dataSource.query(`ALTER TABLE companies ADD COLUMN tokenPassword VARCHAR(20) NULL`);
      }
      
      this.logger.log('✅ Columnas de companies verificadas');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('❌ Error verificando columnas de companies:', error.message);
      }
    }
  }

  private async createAppVersionsTableIfNotExists() {
    try {
      this.logger.log('Verificando si la tabla app_versions existe...');

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS \`app_versions\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
          \`version\` varchar(20) NOT NULL UNIQUE,
          \`downloadUrl\` varchar(500) NOT NULL,
          \`changeLog\` json NOT NULL,
          \`forceUpdate\` tinyint(1) NOT NULL DEFAULT 0,
          \`releaseDate\` date NOT NULL,
          \`fileSize\` bigint(20) NOT NULL,
          \`checksum\` varchar(255) NOT NULL,
          \`fileName\` varchar(255) NULL,
          \`originalFileName\` varchar(255) NULL,
          \`filePath\` varchar(255) NULL,
          \`isActive\` tinyint(1) NOT NULL DEFAULT 1,
          \`isLatest\` tinyint(1) NOT NULL DEFAULT 0,
          \`description\` varchar(500) NULL,
          \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;

      await this.dataSource.query(createTableSQL);
      this.logger.log('✅ Tabla app_versions verificada/creada exitosamente');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('❌ Error creando tabla app_versions:', error.message);
      }
      throw error;
    }
  }

  private async createUsersSoltecTableIfNotExists() {
    try {
      this.logger.log('Verificando si la tabla users_soltec existe...');

      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS \`users_soltec\` (
          \`id\` varchar(36) NOT NULL PRIMARY KEY,
          \`username\` varchar(255) NOT NULL UNIQUE,
          \`email\` varchar(255) NOT NULL UNIQUE,
          \`password\` varchar(255) NOT NULL,
          \`name\` varchar(255) NOT NULL,
          \`role\` enum('ADMIN', 'DEALER', 'USER') NOT NULL DEFAULT 'USER',
          \`document_person_responsible\` varchar(255) NULL,
          \`first_name_person_responsible\` varchar(255) NULL,
          \`last_name_person_responsible\` varchar(255) NULL,
          \`job_title_person_responsible\` varchar(255) NULL,
          \`company_document\` varchar(255) NULL,
          \`organization_department_person_responsible\` varchar(255) NULL,
          \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;

      await this.dataSource.query(createTableSQL);
      this.logger.log('✅ Tabla users_soltec verificada/creada exitosamente');
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('❌ Error creando tabla users_soltec:', error.message);
      }
      throw error;
    }
  }

  private async createDefaultAdmin() {
    try {
      this.logger.log('Verificando si el usuario admin existe...');
      const adminExists =
        await this.userRepository.findByEmail('admin@example.com');

      if (!adminExists) {
        this.logger.log('Creando usuario admin por defecto...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminUserData = {
          email: 'admin@example.com',
          username: 'admin',
          password: hashedPassword,
          name: 'Administrador',
          role: Role.ADMIN
        };

        await this.userRepository.create(adminUserData);
        this.logger.log('✅ Usuario admin creado exitosamente');
      } else {
        this.logger.log('✅ Usuario admin ya existe');
      }
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('❌ Error creando usuario admin:', error.message);
      }
      throw error;
    }
  }
} 