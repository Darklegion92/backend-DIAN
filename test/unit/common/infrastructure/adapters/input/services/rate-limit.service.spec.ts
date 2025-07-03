import { Test, TestingModule } from '@nestjs/testing';
import { RateLimitService } from '@/common/infrastructure/adapters/input/services/rate-limit.service';
import { HttpException } from '@nestjs/common';

describe('RateLimitService', () => {
  let service: RateLimitService;

  beforeEach(async () => {
    jest.useFakeTimers();
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateLimitService],
    }).compile();

    service = module.get<RateLimitService>(RateLimitService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('normalizeIp', () => {
    it('debería normalizar IP localhost IPv6 a IPv4', () => {
      expect(service['normalizeIp']('::1')).toBe('127.0.0.1');
      expect(service['normalizeIp']('::ffff:127.0.0.1')).toBe('127.0.0.1');
    });

    it('debería mantener IPs no locales sin cambios', () => {
      expect(service['normalizeIp']('192.168.1.1')).toBe('192.168.1.1');
    });
  });

  describe('checkRateLimit', () => {
    it('debería permitir solicitudes dentro del límite', () => {
      const ip = '192.168.1.1';
      
      // Realizar 60 solicitudes (límite máximo)
      for (let i = 0; i < 60; i++) {
        expect(() => service.checkRateLimit(ip)).not.toThrow();
      }
    });

    it('debería lanzar excepción cuando se excede el límite', () => {
      const ip = '192.168.1.1';
      
      // Realizar 60 solicitudes (límite máximo)
      for (let i = 0; i < 60; i++) {
        service.checkRateLimit(ip);
      }

      // La siguiente solicitud debería fallar
      expect(() => service.checkRateLimit(ip)).toThrow(HttpException);
      expect(() => service.checkRateLimit(ip)).toThrow(expect.objectContaining({
        message: expect.stringContaining('Demasiadas solicitudes'),
      }));
    });

    it('debería reiniciar el contador después de la ventana de tiempo', () => {
      const ip = '192.168.1.1';
      
      // Realizar 30 solicitudes
      for (let i = 0; i < 30; i++) {
        service.checkRateLimit(ip);
      }

      // Avanzar el tiempo más allá de la ventana
      jest.advanceTimersByTime(61000);

      // Debería permitir 60 solicitudes nuevamente
      for (let i = 0; i < 60; i++) {
        expect(() => service.checkRateLimit(ip)).not.toThrow();
      }
    });
  });

  describe('cleanup', () => {
    it('debería limpiar entradas expiradas', () => {
      const ip = '192.168.1.1';
      
      // Realizar algunas solicitudes
      service.checkRateLimit(ip);
      service.checkRateLimit(ip);

      // Avanzar el tiempo más allá de la ventana
      jest.advanceTimersByTime(61000);

      // Limpiar entradas expiradas
      service.cleanup();

      // Debería permitir 60 solicitudes nuevamente
      for (let i = 0; i < 60; i++) {
        expect(() => service.checkRateLimit(ip)).not.toThrow();
      }
    });
  });
}); 