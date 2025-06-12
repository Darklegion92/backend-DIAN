import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';

export interface PaginatedUsers {
  users: User[];
  total: number;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'name', 'createdAt', 'updatedAt', 'company_document', 'first_name_person_responsible', 'last_name_person_responsible', 'job_title_person_responsible', 'organization_department_person_responsible', 'document_person_responsible'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllPaginated(paginationQuery: PaginationQueryDto): Promise<PaginatedUsers> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationQuery;
    
    const offset = (page - 1) * limit;
    
    const [users, total] = await this.userRepository.findAndCount({
      select: ['id', 'username', 'email', 'role', 'name', 'createdAt', 'updatedAt', 'company_document', 'first_name_person_responsible', 'last_name_person_responsible', 'job_title_person_responsible', 'organization_department_person_responsible', 'document_person_responsible'],
      order: { [sortBy]: sortOrder },
      skip: offset,
      take: limit,
    });

    return { users, total };
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'name', 'createdAt', 'updatedAt', 'company_document', 'first_name_person_responsible', 'last_name_person_responsible', 'job_title_person_responsible', 'organization_department_person_responsible', 'document_person_responsible'],
    });
  }

  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'name', 'password', 'createdAt', 'updatedAt', 'company_document', 'first_name_person_responsible', 'last_name_person_responsible', 'job_title_person_responsible', 'organization_department_person_responsible', 'document_person_responsible'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, { password: hashedPassword });
  }
} 