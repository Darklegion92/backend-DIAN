import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserResponseDto } from '../dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(currentUser: User): Promise<UserResponseDto> {
    // Obtener información completa del usuario desde la base de datos
    const user = await this.userRepository.findById(currentUser.id);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 