import { Injectable, OnModuleInit } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class InitService implements OnModuleInit {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const adminExists = await this.userRepository.findByEmail('admin@example.com');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const user = new User();
      user.email = 'admin@example.com';
      user.username = 'admin';
      user.password = hashedPassword;
      user.name = 'Administrador';
      user.role = UserRole.ADMIN;
      await this.userRepository.save(user);
    }
  }
} 