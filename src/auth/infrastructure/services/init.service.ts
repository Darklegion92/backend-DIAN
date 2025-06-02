import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserRole } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitService implements OnModuleInit {
  private readonly logger = new Logger(InitService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async onModuleInit() {
    try {
      await this.createDefaultAdmin();
    } catch (error) {
      this.logger.error('Error during initialization:', error.message);
      this.logger.warn('Asegúrate de que la tabla users_soltec tenga las columnas: id, username, email, password, name, role, createdAt, updatedAt');
    }
  }

  private async createDefaultAdmin() {
    try {
      this.logger.log('Verificando si el usuario admin existe...');
      const adminExists = await this.userRepository.findByEmail('admin@example.com');
      
      if (!adminExists) {
        this.logger.log('Creando usuario admin por defecto...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUserData = {
          email: 'admin@example.com',
          username: 'admin',
          password: hashedPassword,
          name: 'Administrador',
          role: UserRole.ADMIN,
        };

        await this.userRepository.create(adminUserData);
        this.logger.log('✅ Usuario admin creado exitosamente');
      } else {
        this.logger.log('✅ Usuario admin ya existe');
      }
    } catch (error) {
      this.logger.error('❌ Error creando usuario admin:', error.message);
      throw error;
    }
  }
} 