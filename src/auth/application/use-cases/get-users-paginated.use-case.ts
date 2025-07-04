import { Injectable } from '@nestjs/common';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { InternalUserResponseDto } from '@/auth/application/ports/output/dtos/user-response.dto';
import { PaginationQueryDto } from '@/common/presentation/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '@/common/presentation/dtos/paginated-response.dto';
import { User } from '@/auth/domain/entities/user.entity';

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
      company_document: user.company_document,
      first_name_person_responsible: user.first_name_person_responsible,
      last_name_person_responsible: user.last_name_person_responsible,
      job_title_person_responsible: user.job_title_person_responsible,
      organization_department_person_responsible: user.organization_department_person_responsible,
      document_person_responsible: user.document_person_responsible,
    }));

    return PaginatedResponseDto.create(
      userResponseDtos,
      total,
      paginationQuery.page || 1,
      paginationQuery.limit || 10,
    );
  }
} 