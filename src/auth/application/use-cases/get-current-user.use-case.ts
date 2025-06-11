import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { InternalUserResponseDto } from '../dtos/user-response.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(currentUser: User): Promise<InternalUserResponseDto> {
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
      company_document: user.company_document,
      first_name_person_responsible: user.first_name_person_responsible,
      last_name_person_responsible: user.last_name_person_responsible,
      job_title_person_responsible: user.job_title_person_responsible,
      organization_department_person_responsible: user.organization_department_person_responsible,
      document_person_responsible: user.document_person_responsible,
    };
  }
} 