import { Test, TestingModule } from '@nestjs/testing';
import { GetUsersPaginatedUseCase } from '@/auth/application/use-cases/get-users-paginated.use-case';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { User } from '@/auth/domain/entities/user.entity';
import { PaginationQueryDto } from '@/common/application/ports/output/dtos/pagination-query.dto';
import { Role } from '@/auth/domain/enums/role.enum';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GetUsersPaginatedUseCase', () => {
  let useCase: GetUsersPaginatedUseCase;
  let userRepository: UserRepository;

  const mockUsers: User[] = [
    {
      id: '1',
      username: 'user1',
      email: 'user1@example.com',
      password: 'hashedPassword1',
      name: 'User One',
      role: Role.ADMIN,
      company_document: '123',
      document_person_responsible: '987',
      first_name_person_responsible: 'John',
      last_name_person_responsible: 'Doe',
      job_title_person_responsible: 'Dev',
      organization_department_person_responsible: 'IT',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      username: 'user2',
      email: 'user2@example.com',
      password: 'hashedPassword2',
      name: 'User Two',
      role: Role.USER,
      company_document: '456',
      document_person_responsible: '654',
      first_name_person_responsible: 'Jane',
      last_name_person_responsible: 'Smith',
      job_title_person_responsible: 'Manager',
      organization_department_person_responsible: 'HR',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersPaginatedUseCase,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
            count: jest.fn()
          }
        },
        {
          provide: UserRepository,
          useValue: {
            findAllPaginated: jest.fn()
          }
        }
      ]
    }).compile();

    useCase = module.get<GetUsersPaginatedUseCase>(GetUsersPaginatedUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('debe estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const paginationQuery = new PaginationQueryDto();
    paginationQuery.page = 1;
    paginationQuery.limit = 10;

    it('debe retornar usuarios paginados', async () => {
      const mockRepositoryResult = {
        users: mockUsers,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      };

      jest.spyOn(userRepository, 'findAllPaginated').mockResolvedValue(mockRepositoryResult);

      const result = await useCase.execute(paginationQuery);

      expect(result).toBeDefined();
      expect(result.data.length).toBe(2);
      expect(result.meta.totalItems).toBe(2);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.itemsPerPage).toBe(10);
      expect(result.meta.totalPages).toBe(1);
    });

    it('debe retornar página vacía cuando no hay usuarios', async () => {
      const emptyRepositoryResult = {
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      };

      jest.spyOn(userRepository, 'findAllPaginated').mockResolvedValue(emptyRepositoryResult);

      const result = await useCase.execute(paginationQuery);

      expect(result).toBeDefined();
      expect(result.data.length).toBe(0);
      expect(result.meta.totalItems).toBe(0);
      expect(result.meta.totalPages).toBe(0);
    });
  });
}); 