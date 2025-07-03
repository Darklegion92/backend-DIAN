import { Test, TestingModule } from '@nestjs/testing';
import { LogoutUseCase } from '@/auth/application/use-cases/logout.use-case';
import { HostBlockService } from '@/auth/domain/services/security/host-block.service';

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogoutUseCase,
        {
          provide: HostBlockService,
          useValue: {
            resetAttempts: jest.fn()
          }
        }
      ]
    }).compile();

    useCase = module.get<LogoutUseCase>(LogoutUseCase);
  });

  describe('execute', () => {
    it('debe ejecutar el logout exitosamente', async () => {
      const result = await useCase.execute();

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Sesión cerrada exitosamente');
    });
  });
}); 