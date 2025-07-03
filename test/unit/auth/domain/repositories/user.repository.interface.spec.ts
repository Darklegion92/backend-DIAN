import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';

describe('UserRepository Interface Conformance', () => {
  let userRepository: UserRepository;
  let ormRepo: Repository<User>;

  const mockUser = {
    id: 'uuid',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    role: Role.ADMIN,
    password: 'hashedPassword',
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
        UserRepository,
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
        }
      ]
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    ormRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('Verificación de implementación de IUserRepository', () => {
    it('debe implementar todos los métodos requeridos', () => {
      expect(userRepository.findByUsername).toBeDefined();
      expect(userRepository.create).toBeDefined();
      expect(userRepository.findByEmail).toBeDefined();
      expect(userRepository.findById).toBeDefined();
      expect(userRepository.findByIdWithPassword).toBeDefined();
      expect(userRepository.save).toBeDefined();
      expect(userRepository.updatePassword).toBeDefined();
    });

    it('debe implementar findByUsername correctamente', async () => {
      (ormRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.findByUsername('testuser');
      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
    });

    it('debe implementar create correctamente', async () => {
      (ormRepo.create as jest.Mock).mockReturnValue(mockUser);
      (ormRepo.save as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.create(mockUser);
      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
    });

    it('debe implementar findByEmail correctamente', async () => {
      (ormRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.findByEmail('test@example.com');
      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
    });

    it('debe implementar findById correctamente', async () => {
      (ormRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.findById('uuid');
      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
    });

    it('debe implementar findByIdWithPassword correctamente', async () => {
      (ormRepo.findOne as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.findByIdWithPassword('uuid');
      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
    });

    it('debe implementar save correctamente', async () => {
      (ormRepo.save as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.save(mockUser as User);
      expect(result).toBeDefined();
      expect(result).toEqual(mockUser);
    });

    it('debe implementar updatePassword correctamente', async () => {
      (ormRepo.update as jest.Mock).mockResolvedValue(undefined);
      await userRepository.updatePassword('uuid', 'newHashedPassword');
      expect(ormRepo.update).toHaveBeenCalledWith('uuid', { password: 'newHashedPassword' });
    });
  });

  describe('Verificación de tipos de retorno', () => {
    it('debe retornar Promise<User | null> en métodos de búsqueda', async () => {
      (ormRepo.findOne as jest.Mock).mockResolvedValue(null);
      const result = await userRepository.findById('uuid');
      expect(result).toBeNull();
    });

    it('debe retornar Promise<User> en métodos de creación', async () => {
      (ormRepo.create as jest.Mock).mockReturnValue(mockUser);
      (ormRepo.save as jest.Mock).mockResolvedValue(mockUser);
      const result = await userRepository.create(mockUser);
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty('id');
    });

    it('debe retornar Promise<void> en métodos de actualización de contraseña', async () => {
      (ormRepo.update as jest.Mock).mockResolvedValue(undefined);
      const result = await userRepository.updatePassword('uuid', 'newPassword');
      expect(result).toBeUndefined();
    });
  });
}); 