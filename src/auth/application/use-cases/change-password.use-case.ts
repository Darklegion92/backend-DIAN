import { Injectable, UnauthorizedException, Inject, NotFoundException } from '@nestjs/common';
import { User } from '@/auth/domain/entities/user.entity';

import { ChangePasswordDto } from '@/auth/application/ports/input/dtos/change-password.dto';
import * as bcrypt from 'bcrypt';
import { IUserRepository, USER_REPOSITORY } from '@/auth/domain/repositories/user.repository.interface';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository
  ) {}

  async execute(currentUser: User, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { oldPassword, password } = changePasswordDto;

    // Obtener el usuario completo con la contraseña incluida
    const userWithPassword = await this.userRepository.findByIdWithPassword(currentUser.id);
    if (!userWithPassword) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que la contraseña esté disponible
    if (!userWithPassword.password) {
      throw new Error('No se pudo obtener la contraseña del usuario');
    }

    // Verificar que la contraseña actual sea correcta
    const isCurrentPasswordValid = await bcrypt.compare(oldPassword, userWithPassword.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Verificar que la nueva contraseña sea diferente a la actual
    const isSamePassword = await bcrypt.compare(password, userWithPassword.password);
    if (isSamePassword) {
      throw new UnauthorizedException('La nueva contraseña debe ser diferente a la actual');
    }

    // Encriptar la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Actualizar la contraseña en la base de datos
    await this.userRepository.updatePassword(currentUser.id, hashedPassword);
  }
} 