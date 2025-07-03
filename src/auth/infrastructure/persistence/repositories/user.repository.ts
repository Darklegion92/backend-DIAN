import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, ILike, FindOptionsSelect } from 'typeorm';

import { User } from "@/auth/domain/entities/user.entity";
import { PaginationQueryDto } from '@/common/presentation/dtos/pagination-query.dto';
import { Role } from '@/auth/domain/enums/role.enum';
import { IUserRepository } from '@/auth/domain/repositories/user.repository.interface';

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly defaultSelectFields: FindOptionsSelect<User> = {
    id: true,
    username: true,
    email: true,
    role: true,
    name: true,
    createdAt: true,
    updatedAt: true,
    company_document: true,
    first_name_person_responsible: true,
    last_name_person_responsible: true,
    job_title_person_responsible: true,
    organization_department_person_responsible: true,
    document_person_responsible: true
  };

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: this.defaultSelectFields,
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPaginated(paginationQuery: PaginationQueryDto): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationQuery;
    const offset = paginationQuery.getOffset();
    
    const [users, total] = await this.userRepository.findAndCount({
      select: this.defaultSelectFields,
      order: { [sortBy]: sortOrder },
      skip: offset,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      total,
      page,
      limit,
      totalPages
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: this.defaultSelectFields,
    });
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: { ...this.defaultSelectFields, password: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: this.defaultSelectFields,
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      select: { ...this.defaultSelectFields, password: true },
    });
  }

  async findByRole(role: Role): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      select: this.defaultSelectFields,
    });
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { username: ILike(`%${query}%`) },
        { email: ILike(`%${query}%`) },
        { name: ILike(`%${query}%`) }
      ],
      select: this.defaultSelectFields,
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, userData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.userRepository.restore(id);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { id } });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }
} 