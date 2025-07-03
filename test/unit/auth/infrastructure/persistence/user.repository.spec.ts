import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let typeormRepository: Repository<User>;

  const mockUser: User = {
    id: 'uuid-123',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: Role.USER,
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    company_document: '123456789',
    first_name_person_responsible: 'John',
    last_name_person_responsible: 'Doe',
    job_title_person_responsible: 'Developer',
    organization_department_person_responsible: 'IT',
    document_person_responsible: '987654321'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            restore: jest.fn(),
            count: jest.fn()
          }
        }
      ]
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    typeormRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('debe estar definido', () => {
    expect(userRepository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('debe encontrar un usuario por email', async () => {
      // Arrange
      jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(mockUser);

      // Act
      const result = await userRepository.findByEmail('test@example.com');

      // Assert
      expect(result).toEqual(mockUser);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: expect.any(Object)
      });
    });

    it('debe retornar null si no encuentra el usuario', async () => {
      // Arrange
      jest.spyOn(typeormRepository, 'findOne').mockResolvedValue(null);

      // Act
      const result = await userRepository.findByEmail('nonexistent@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('debe crear un nuevo usuario', async () => {
      // Arrange
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'hashedPassword',
        role: Role.USER,
        name: 'New User'
      };

      jest.spyOn(typeormRepository, 'create').mockReturnValue(mockUser);
      jest.spyOn(typeormRepository, 'save').mockResolvedValue(mockUser);

      // Act
      const result = await userRepository.create(userData);

      // Assert
      expect(result).toEqual(mockUser);
      expect(typeormRepository.create).toHaveBeenCalledWith(userData);
      expect(typeormRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('exists', () => {
    it('debe retornar true si el usuario existe', async () => {
      // Arrange
      jest.spyOn(typeormRepository, 'count').mockResolvedValue(1);

      // Act
      const result = await userRepository.exists('uuid-123');

      // Assert
      expect(result).toBe(true);
      expect(typeormRepository.count).toHaveBeenCalledWith({ where: { id: 'uuid-123' } });
    });

    it('debe retornar false si el usuario no existe', async () => {
      // Arrange
      jest.spyOn(typeormRepository, 'count').mockResolvedValue(0);

      // Act
      const result = await userRepository.exists('nonexistent-id');

      // Assert
      expect(result).toBe(false);
    });
  });
}); 