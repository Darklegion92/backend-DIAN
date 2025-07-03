import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/auth/presentation/controllers/auth.controller';
import { LoginUseCase } from '@/auth/application/use-cases/login.use-case';
import { LogoutUseCase } from '@/auth/application/use-cases/logout.use-case';
import { LoginDto } from '@/auth/presentation/dtos/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: LoginUseCase;
  let logoutUseCase: LogoutUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: {
            execute: jest.fn()
          }
        },
        {
          provide: LogoutUseCase,
          useValue: {
            execute: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    logoutUseCase = module.get<LogoutUseCase>(LogoutUseCase);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      username: 'testuser',
      password: 'password123'
    };

    const mockRequest = {
      ip: '192.168.1.1',
      socket: { remoteAddress: '192.168.1.1' },
      headers: {}
    } as any;

    it('debe llamar al LoginUseCase', async () => {
      // Arrange
      const mockResult = { access_token: 'token', user: { id: '123' } };
      jest.spyOn(loginUseCase, 'execute').mockResolvedValue(mockResult as any);

      // Act
      const result = await controller.login(loginDto, mockRequest);

      // Assert
      expect(loginUseCase.execute).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('debe propagar errores del LoginUseCase', async () => {
      // Arrange
      jest.spyOn(loginUseCase, 'execute').mockRejectedValue(
        new UnauthorizedException('Credenciales inválidas')
      );

      // Act & Assert
      await expect(controller.login(loginDto, mockRequest)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('logout', () => {
    it('debe llamar al LogoutUseCase', async () => {
      // Arrange
      const mockResult = { message: 'Logout exitoso' };
      jest.spyOn(logoutUseCase, 'execute').mockResolvedValue(mockResult as any);

      // Act
      const result = await controller.logout();

      // Assert
      expect(logoutUseCase.execute).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
}); 