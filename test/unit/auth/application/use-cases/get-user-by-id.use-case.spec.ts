import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByIdUseCase } from '@/auth/application/use-cases/get-user-by-id.use-case';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { NotFoundException } from '@nestjs/common';
import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
  let userRepository: UserRepository;

  const mockUser: User = {
    id: 'uuid',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Role.ADMIN,
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    company_document: '123',
    first_name_person_responsible: 'John',
    last_name_person_responsible: 'Doe',
    job_title_person_responsible: 'Dev',
    organization_department_person_responsible: 'IT',
    document_person_responsible: '987'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdUseCase,
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
            findById: jest.fn()
          }
        }
      ]
    }).compile();

    useCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('execute', () => {
    it('debe retornar el usuario por ID', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);

      const result = await useCase.execute('uuid');

      expect(result).toBeDefined();
      const { password, ...expectedUser } = mockUser;
      expect(result).toEqual(expectedUser);
    });

    it('debe lanzar NotFoundException cuando el usuario no existe', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(useCase.execute('uuid')).rejects.toThrow(NotFoundException);
    });
  });
}); 