import { Test, TestingModule } from '@nestjs/testing';
import { HostBlockService } from '@/auth/domain/services/security/host-block.service';
import { Logger } from '@nestjs/common';

describe('HostBlockService', () => {
  let service: HostBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HostBlockService],
    }).compile();

    service = module.get<HostBlockService>(HostBlockService);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debería normalizar IPs de localhost', () => {
    expect(service['isHostBlocked']('::1')).toBe(false);
    expect(service['isHostBlocked']('::ffff:127.0.0.1')).toBe(false);
    expect(service['isHostBlocked']('127.0.0.1')).toBe(false);
  });

  it('debería bloquear IP después de múltiples intentos fallidos', () => {
    const ip = '192.168.1.1';
    
    // Registrar 5 intentos fallidos
    for (let i = 0; i < 5; i++) {
      service.recordFailedAttempt(ip);
    }

    expect(service.isHostBlocked(ip)).toBe(true);
    expect(service.getRemainingBlockTime(ip)).toBeGreaterThan(0);
  });

  it('debería permitir IP después de que expire el bloqueo', () => {
    const ip = '192.168.1.1';
    
    // Registrar 5 intentos fallidos
    for (let i = 0; i < 5; i++) {
      service.recordFailedAttempt(ip);
    }

    // Simular que ha pasado el tiempo de bloqueo
    const blockedHosts = service['getBlockedHosts']();
    const blockedHost = blockedHosts.get(ip);
    if (blockedHost) {
      blockedHost.blockedUntil = new Date(Date.now() - 1000); // 1 segundo en el pasado
      blockedHosts.set(ip, blockedHost);
    }

    expect(service.isHostBlocked(ip)).toBe(false);
    expect(service.getRemainingBlockTime(ip)).toBe(0);
  });

  it('debería resetear los intentos fallidos', () => {
    const ip = '192.168.1.1';
    
    // Registrar algunos intentos fallidos
    service.recordFailedAttempt(ip);
    service.recordFailedAttempt(ip);

    // Resetear intentos
    service.resetAttempts(ip);

    expect(service.isHostBlocked(ip)).toBe(false);
    expect(service.getRemainingBlockTime(ip)).toBe(0);
  });

  it('debería mantener el conteo de intentos fallidos', () => {
    const ip = '192.168.1.1';
    
    // Registrar 3 intentos fallidos
    for (let i = 0; i < 3; i++) {
      service.recordFailedAttempt(ip);
    }

    expect(service.isHostBlocked(ip)).toBe(false);
    expect(service.getRemainingBlockTime(ip)).toBe(0);
  });

  it('debería permitir IPs no bloqueadas', () => {
    const ip = '192.168.1.1';
    expect(service.isHostBlocked(ip)).toBe(false);
    expect(service.getRemainingBlockTime(ip)).toBe(0);
  });
}); 