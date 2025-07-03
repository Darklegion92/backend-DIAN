import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from '@/auth/application/use-cases/update-user.use-case';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';

describe('UpdateUserUseCase', () => {
  let useCase: UpdateUserUseCase;
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
        UpdateUserUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    useCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = module.get<UserRepository>('USER_REPOSITORY');
  });

  describe('execute', () => {
    const updateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com'
    };

    it('debe actualizar el usuario exitosamente', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        ...mockUser,
        ...updateUserDto
      });

      const result = await useCase.execute('uuid', updateUserDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(updateUserDto.name);
      expect(result.email).toBe(updateUserDto.email);
    });

    it('debe lanzar NotFoundException cuando el usuario no existe', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(null);

      await expect(useCase.execute('uuid', updateUserDto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar ConflictException cuando el email ya está registrado', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValue(mockUser);
      jest.spyOn(userRepository, 'findByEmail').mockResolvedValue({
        ...mockUser,
        id: 'different-uuid'
      });

      await expect(useCase.execute('uuid', updateUserDto)).rejects.toThrow(ConflictException);
    });
  });
}); 