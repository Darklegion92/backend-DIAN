import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RateLimitService } from '@/common/infrastructure/services/rate-limit.service';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  constructor(private readonly rateLimitService: RateLimitService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.socket.remoteAddress;

    // Verificar límite de tasa
    this.rateLimitService.checkRateLimit(ip);

    return next.handle();
  }
} 