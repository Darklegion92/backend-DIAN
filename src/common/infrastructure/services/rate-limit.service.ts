import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

interface RateLimitInfo {
  count: number;
  resetTime: Date;
}

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);
  private readonly requestCounts: Map<string, RateLimitInfo> = new Map();
  private readonly WINDOW_SIZE_MS = 60000; // 1 minuto
  private readonly MAX_REQUESTS_PER_WINDOW = 60; // 60 solicitudes por minuto

  private normalizeIp(ip: string): string {
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      return '127.0.0.1';
    }
    return ip;
  }

  checkRateLimit(ip: string): void {
    const normalizedIp = this.normalizeIp(ip);
    const now = new Date();
    let rateLimitInfo = this.requestCounts.get(normalizedIp);

    // Si no hay información o la ventana de tiempo ha expirado, reiniciar
    if (!rateLimitInfo || rateLimitInfo.resetTime <= now) {
      rateLimitInfo = {
        count: 0,
        resetTime: new Date(now.getTime() + this.WINDOW_SIZE_MS)
      };
    }

    // Incrementar contador
    rateLimitInfo.count++;
    this.requestCounts.set(normalizedIp, rateLimitInfo);

    // Verificar límite
    if (rateLimitInfo.count > this.MAX_REQUESTS_PER_WINDOW) {
      const remainingTime = Math.ceil((rateLimitInfo.resetTime.getTime() - now.getTime()) / 1000);
      this.logger.warn(`IP ${normalizedIp} ha excedido el límite de solicitudes. Tiempo restante: ${remainingTime} segundos`);
      throw new HttpException(
        `Demasiadas solicitudes. Por favor, intente nuevamente en ${remainingTime} segundos.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    this.logger.debug(`IP ${normalizedIp} - Solicitudes en la ventana actual: ${rateLimitInfo.count}/${this.MAX_REQUESTS_PER_WINDOW}`);
  }

  // Método para limpiar entradas antiguas
  cleanup(): void {
    const now = new Date();
    for (const [ip, info] of this.requestCounts.entries()) {
      if (info.resetTime <= now) {
        this.requestCounts.delete(ip);
      }
    }
  }
} 