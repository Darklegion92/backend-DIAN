import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { User } from '@/auth/domain/entities/user.entity';
import { USER_REPOSITORY } from '@/auth/domain/repositories/user.repository.interface';

@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return this.userRepository.findAll();
  }
} 