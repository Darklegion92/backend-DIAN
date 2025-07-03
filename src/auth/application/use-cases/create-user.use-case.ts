import { Injectable, ConflictException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { CreateUserDto } from '@/auth/application/ports/input/dtos/create-user.dto';
import { User } from '@/auth/domain/entities/user.entity';
import { USER_REPOSITORY } from '@/auth/domain/repositories/user.repository.interface';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = new User();
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.name = createUserDto.name;
    user.role = createUserDto.role;
    user.username = createUserDto.username;
    user.company_document = createUserDto.company_document;
    user.first_name_person_responsible = createUserDto.first_name_person_responsible || '';
    user.last_name_person_responsible = createUserDto.last_name_person_responsible || '';
    user.job_title_person_responsible = createUserDto.job_title_person_responsible || '';
    user.organization_department_person_responsible = createUserDto.organization_department_person_responsible || '';
    user.document_person_responsible = createUserDto.document_person_responsible || '';
    
    return this.userRepository.save(user);
  }
} 