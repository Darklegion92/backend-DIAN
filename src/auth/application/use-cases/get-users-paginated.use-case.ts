import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { InternalUserResponseDto } from '../dtos/user-response.dto';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dtos/paginated-response.dto';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUsersPaginatedUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<InternalUserResponseDto>> {
    const { users, total } = await this.userRepository.findAllPaginated(paginationQuery);
    
    const userResponseDtos: InternalUserResponseDto[] = users.map((user: User) => ({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return PaginatedResponseDto.create(
      userResponseDtos,
      total,
      paginationQuery.page,
      paginationQuery.limit,
    );
  }
} 