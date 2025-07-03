import { ExecutionContext, CallHandler } from '@nestjs/common';
import { RateLimitInterceptor } from '@/common/infrastructure/adapters/input/interceptors/rate-limit.interceptor';
import { RateLimitService } from '@/common/infrastructure/adapters/input/services/rate-limit.service';
import { of } from 'rxjs';

describe('RateLimitInterceptor', () => {
  let interceptor: RateLimitInterceptor;
  let rateLimitService: jest.Mocked<RateLimitService>;

  beforeEach(() => {
    rateLimitService = {
      checkRateLimit: jest.fn(),
    } as any;

    interceptor = new RateLimitInterceptor(rateLimitService);
  });

  it('debería estar definido', () => {
    expect(interceptor).toBeDefined();
  });

  it('debería verificar el límite de tasa usando la IP del request', () => {
    // Arrange
    const mockIp = '192.168.1.1';
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          ip: mockIp,
          socket: {
            remoteAddress: '192.168.1.2',
          },
        }),
      }),
    } as ExecutionContext;

    const mockHandler = {
      handle: () => of('test'),
    } as CallHandler;

    // Act
    interceptor.intercept(mockContext, mockHandler);

    // Assert
    expect(rateLimitService.checkRateLimit).toHaveBeenCalledWith(mockIp);
  });

  it('debería usar remoteAddress si ip no está disponible', () => {
    // Arrange
    const mockRemoteAddress = '192.168.1.2';
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          socket: {
            remoteAddress: mockRemoteAddress,
          },
        }),
      }),
    } as ExecutionContext;

    const mockHandler = {
      handle: () => of('test'),
    } as CallHandler;

    // Act
    interceptor.intercept(mockContext, mockHandler);

    // Assert
    expect(rateLimitService.checkRateLimit).toHaveBeenCalledWith(mockRemoteAddress);
  });

  it('debería continuar con el handler después de verificar el límite', async () => {
    // Arrange
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          ip: '192.168.1.1',
        }),
      }),
    } as ExecutionContext;

    const mockHandler = {
      handle: () => of('test'),
    } as CallHandler;

    // Act
    const result = await interceptor.intercept(mockContext, mockHandler).toPromise();

    // Assert
    expect(result).toBe('test');
  });
}); 