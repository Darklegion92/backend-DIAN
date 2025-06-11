import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('El email ya está registrado');
      }
      user.email = updateUserDto.email;
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.role) {
      user.role = updateUserDto.role;
    }

    if (updateUserDto.company_document) {
      user.company_document = updateUserDto.company_document;
    }

    if (updateUserDto.first_name_person_responsible) {
      user.first_name_person_responsible = updateUserDto.first_name_person_responsible;
    }

    if (updateUserDto.last_name_person_responsible) {
      user.last_name_person_responsible = updateUserDto.last_name_person_responsible;
    }

    if (updateUserDto.job_title_person_responsible) {
      user.job_title_person_responsible = updateUserDto.job_title_person_responsible;
    }

    if (updateUserDto.organization_department_person_responsible) {
      user.organization_department_person_responsible = updateUserDto.organization_department_person_responsible;
    }

    if (updateUserDto.document_person_responsible) {
      user.document_person_responsible = updateUserDto.document_person_responsible;
    }
    return this.userRepository.save(user);
  }
} 