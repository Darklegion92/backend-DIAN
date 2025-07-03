import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserUseCase } from '@/auth/application/use-cases/create-user.use-case';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { ConflictException } from '@nestjs/common';
import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';
import * as bcrypt from 'bcrypt';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
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
        CreateUserUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findByUsername: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    userRepository = module.get<UserRepository>('USER_REPOSITORY');
  });

  describe('execute', () => {
    const createUserDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
      role: Role.ADMIN,
      name: 'New User',
      company_document: '456',
      first_name_person_responsible: 'Jane',
      last_name_person_responsible: 'Smith',
      job_title_person_responsible: 'Manager',
      organization_department_person_responsible: 'HR',
      document_person_responsible: '789'
    };

    it('debe crear un usuario exitosamente', async () => {
      const mockCreatedUser: User = {
        ...createUserDto,
        password: 'hashedPassword',
        id: 'uuid',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockCreatedUser);

      const result = await useCase.execute(createUserDto);

      expect(result).toBeDefined();
      expect(result).toEqual(expect.objectContaining({
        username: createUserDto.username,
        email: createUserDto.email,
        password: 'hashedPassword'
      }));
      expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        username: createUserDto.username,
        email: createUserDto.email,
        password: 'hashedPassword'
      }));
    });

    it('debe lanzar ConflictException cuando el email ya existe', async () => {
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(mockUser);

      await expect(useCase.execute(createUserDto)).rejects.toThrow(ConflictException);
    });
  });
}); 