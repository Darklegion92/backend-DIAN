import { Injectable, NotFoundException } from '@nestjs/common';
import { InternalUserResponseDto } from '@/auth/application/ports/output/dtos/user-response.dto';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<InternalUserResponseDto> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
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