import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordUseCase } from '@/auth/application/use-cases/change-password.use-case';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';
import * as bcrypt from 'bcrypt';

describe('ChangePasswordUseCase', () => {
  let useCase: ChangePasswordUseCase;
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
        ChangePasswordUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findByIdWithPassword: jest.fn(),
            updatePassword: jest.fn()
          }
        }
      ]
    }).compile();

    useCase = module.get<ChangePasswordUseCase>(ChangePasswordUseCase);
    userRepository = module.get<UserRepository>('USER_REPOSITORY');
  });

  describe('execute', () => {
    const changePasswordDto = {
      userId: 'uuid',
      oldPassword: 'oldPassword123',
      password: 'newPassword123',
      confirmPassword: 'newPassword123'
    };

    it('debe cambiar la contraseña exitosamente', async () => {
      jest.spyOn(userRepository, 'findByIdWithPassword').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare')
        .mockImplementation((password, hashedPassword) => {
          if (password === changePasswordDto.oldPassword) {
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        });
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('newHashedPassword'));

      await useCase.execute(mockUser, changePasswordDto);

      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        changePasswordDto.userId,
        'newHashedPassword'
      );
    });

    it('debe lanzar UnauthorizedException cuando la contraseña actual es incorrecta', async () => {
      jest.spyOn(userRepository, 'findByIdWithPassword').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(useCase.execute(mockUser, changePasswordDto)).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException cuando la nueva contraseña es igual a la actual', async () => {
      jest.spyOn(userRepository, 'findByIdWithPassword').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare')
        .mockImplementation((password, hashedPassword) => {
          if (password === changePasswordDto.oldPassword) {
            return Promise.resolve(true);
          }
          if (password === changePasswordDto.password) {
            return Promise.resolve(true);
          }
          return Promise.resolve(false);
        });

      await expect(useCase.execute(mockUser, changePasswordDto)).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar NotFoundException cuando el usuario no existe', async () => {
      jest.spyOn(userRepository, 'findByIdWithPassword').mockResolvedValue(null);

      await expect(useCase.execute(mockUser, changePasswordDto)).rejects.toThrow(NotFoundException);
    });
  });
}); 