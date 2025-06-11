import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { LoginDto } from '../dtos/login.dto';
import { InternalLoginDataDto } from '../dtos/login-data.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(loginDto: LoginDto): Promise<InternalLoginDataDto> {
    const user = await this.userRepository.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { 
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company_document: user.company_document,
        first_name_person_responsible: user.first_name_person_responsible,
        last_name_person_responsible: user.last_name_person_responsible,
        job_title_person_responsible: user.job_title_person_responsible,
        organization_department_person_responsible: user.organization_department_person_responsible,
        document_person_responsible: user.document_person_responsible
      }
    };
  }
} 