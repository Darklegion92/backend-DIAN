import { Test, TestingModule } from '@nestjs/testing';
import { LoginUseCase } from '@/auth/application/use-cases/login.use-case';
import { UserRepository } from '@/auth/infrastructure/persistence/repositories/user.repository';
import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';
import { UnauthorizedException, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HostBlockService } from '@/auth/domain/services/security/host-block.service';
import * as bcrypt from 'bcrypt';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: UserRepository;
  let hostBlockService: HostBlockService;

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

  const mockJwtToken = 'mock.jwt.token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            findByUsername: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockJwtToken)
          }
        },
        {
          provide: HostBlockService,
          useValue: {
            isHostBlocked: jest.fn().mockReturnValue(false),
            getRemainingBlockTime: jest.fn(),
            recordFailedAttempt: jest.fn(),
            resetAttempts: jest.fn()
          }
        }
      ]
    }).compile();

    useCase = module.get<LoginUseCase>(LoginUseCase);
    userRepository = module.get('USER_REPOSITORY');
    hostBlockService = module.get<HostBlockService>(HostBlockService);
  });

  it('debe estar definido', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const loginDto = {
      username: 'testuser',
      password: 'password123'
    };
    const mockIp = '192.168.1.1';

    it('debe realizar login exitosamente', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await useCase.execute(loginDto, mockIp);

      expect(result).toBeDefined();
      expect(result.access_token).toBe(mockJwtToken);
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        company_document: mockUser.company_document,
        first_name_person_responsible: mockUser.first_name_person_responsible,
        last_name_person_responsible: mockUser.last_name_person_responsible,
        job_title_person_responsible: mockUser.job_title_person_responsible,
        organization_department_person_responsible: mockUser.organization_department_person_responsible,
        document_person_responsible: mockUser.document_person_responsible
      });
      expect(userRepository.findByUsername).toHaveBeenCalledWith(loginDto.username);
      expect(hostBlockService.resetAttempts).toHaveBeenCalledWith(mockIp);
    });

    it('debe lanzar UnauthorizedException cuando el usuario no existe', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(null);

      await expect(useCase.execute(loginDto, mockIp)).rejects.toThrow(UnauthorizedException);
      expect(hostBlockService.recordFailedAttempt).toHaveBeenCalledWith(mockIp);
    });

    it('debe lanzar UnauthorizedException cuando la contraseña es incorrecta', async () => {
      jest.spyOn(userRepository, 'findByUsername').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(useCase.execute(loginDto, mockIp)).rejects.toThrow(UnauthorizedException);
      expect(hostBlockService.recordFailedAttempt).toHaveBeenCalledWith(mockIp);
    });

    it('debe lanzar HttpException cuando la IP está bloqueada', async () => {
      jest.spyOn(hostBlockService, 'isHostBlocked').mockReturnValue(true);
      jest.spyOn(hostBlockService, 'getRemainingBlockTime').mockReturnValue(5);

      await expect(useCase.execute(loginDto, mockIp)).rejects.toThrow(HttpException);
      expect(hostBlockService.getRemainingBlockTime).toHaveBeenCalledWith(mockIp);
    });
  });
}); 