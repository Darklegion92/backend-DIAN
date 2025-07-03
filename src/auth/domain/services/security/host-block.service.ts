import { Injectable, Logger } from '@nestjs/common';

interface BlockedHost {
  attempts: number;
  blockedUntil: Date;
}

@Injectable()
export class HostBlockService {
  private readonly logger = new Logger(HostBlockService.name);
  private readonly blockedHosts: Map<string, BlockedHost> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION_MINUTES = 5;

  private normalizeIp(ip: string): string {
    // Convertir IPv6 localhost a IPv4 localhost
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      return '127.0.0.1';
    }
    return ip;
  }

  isHostBlocked(ip: string): boolean {
    const normalizedIp = this.normalizeIp(ip);
    this.logger.debug(`Verificando si la IP ${normalizedIp} está bloqueada`);
    const blockedHost = this.blockedHosts.get(normalizedIp);
    
    if (!blockedHost) {
      this.logger.debug(`IP ${normalizedIp} no está en la lista de bloqueados`);
      return false;
    }

    const now = new Date();
    if (blockedHost.blockedUntil > now) {
      const remainingMinutes = Math.ceil((blockedHost.blockedUntil.getTime() - now.getTime()) / 1000 / 60);
      this.logger.debug(`IP ${normalizedIp} está bloqueada. Tiempo restante: ${remainingMinutes} minutos`);
      return true;
    }

    this.logger.debug(`Bloqueo para IP ${normalizedIp} ha expirado. Eliminando de la lista de bloqueados`);
    this.blockedHosts.delete(normalizedIp);
    return false;
  }

  recordFailedAttempt(ip: string): void {
    const normalizedIp = this.normalizeIp(ip);
    this.logger.debug(`Registrando intento fallido para IP ${normalizedIp}`);
    let currentHost = this.blockedHosts.get(normalizedIp);
    
    if (!currentHost) {
      currentHost = {
        attempts: 0,
        blockedUntil: new Date()
      };
    }

    currentHost.attempts += 1;
    this.logger.debug(`IP ${normalizedIp} tiene ${currentHost.attempts} intentos fallidos de ${this.MAX_ATTEMPTS} permitidos`);

    if (currentHost.attempts >= this.MAX_ATTEMPTS) {
      const blockedUntil = new Date();
      blockedUntil.setMinutes(blockedUntil.getMinutes() + this.BLOCK_DURATION_MINUTES);
      currentHost.blockedUntil = blockedUntil;
      this.logger.warn(`IP ${normalizedIp} ha sido bloqueada por ${this.BLOCK_DURATION_MINUTES} minutos debido a ${this.MAX_ATTEMPTS} intentos fallidos`);
    }

    this.blockedHosts.set(normalizedIp, currentHost);
    this.logger.debug(`Estado actual de bloqueo para IP ${normalizedIp}:`, JSON.stringify(currentHost, null, 2));
  }

  resetAttempts(ip: string): void {
    const normalizedIp = this.normalizeIp(ip);
    this.logger.debug(`Reseteando intentos fallidos para IP ${normalizedIp}`);
    this.blockedHosts.delete(normalizedIp);
  }

  getRemainingBlockTime(ip: string): number {
    const normalizedIp = this.normalizeIp(ip);
    const blockedHost = this.blockedHosts.get(normalizedIp);
    if (!blockedHost || blockedHost.blockedUntil <= new Date()) {
      this.logger.debug(`No hay tiempo de bloqueo restante para IP ${normalizedIp}`);
      return 0;
    }
    
    const remainingMinutes = Math.ceil((blockedHost.blockedUntil.getTime() - new Date().getTime()) / 1000 / 60);
    this.logger.debug(`Tiempo restante de bloqueo para IP ${normalizedIp}: ${remainingMinutes} minutos`);
    return remainingMinutes;
  }

  // Método para depuración
  getBlockedHosts(): Map<string, BlockedHost> {
    return this.blockedHosts;
  }
} 