import { Test, TestingModule } from '@nestjs/testing';
import { GetUsersUseCase } from '@/auth/application/use-cases/get-users.use-case';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';

describe('GetUsersUseCase', () => {
  let useCase: GetUsersUseCase;
  let userRepository: UserRepository;

  const mockUsers: User[] = [
    {
      id: 'uuid1',
      username: 'user1',
      email: 'user1@example.com',
      password: 'hashedPassword1',
      role: Role.ADMIN,
      name: 'User One',
      createdAt: new Date(),
      updatedAt: new Date(),
      company_document: '123',
      first_name_person_responsible: 'John',
      last_name_person_responsible: 'Doe',
      job_title_person_responsible: 'Dev',
      organization_department_person_responsible: 'IT',
      document_person_responsible: '987'
    },
    {
      id: 'uuid2',
      username: 'user2',
      email: 'user2@example.com',
      password: 'hashedPassword2',
      role: Role.USER,
      name: 'User Two',
      createdAt: new Date(),
      updatedAt: new Date(),
      company_document: '456',
      first_name_person_responsible: 'Jane',
      last_name_person_responsible: 'Smith',
      job_title_person_responsible: 'Manager',
      organization_department_person_responsible: 'HR',
      document_person_responsible: '654'
    }
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findAll: jest.fn()
          }
        }
      ]
    }).compile();

    useCase = module.get<GetUsersUseCase>(GetUsersUseCase);
    userRepository = module.get('USER_REPOSITORY');
  });

  describe('execute', () => {
    it('debe retornar la lista de usuarios', async () => {
      jest.spyOn(userRepository, 'findAll').mockResolvedValue(mockUsers);

      const result = await useCase.execute();

      expect(result).toBeDefined();
      expect(result).toEqual(mockUsers);
      expect(result.length).toBe(2);
    });

    it('debe retornar un array vacío cuando no hay usuarios', async () => {
      jest.spyOn(userRepository, 'findAll').mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toBeDefined();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });
}); 