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
      await this.createDefaultAdmin();
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error during initialization:', error.message);
      }
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