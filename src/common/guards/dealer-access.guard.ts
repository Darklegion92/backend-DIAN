import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole } from '../../auth/domain/entities/user.entity';

@Injectable()
export class DealerAccessGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new ForbiddenException('Token no encontrado');
    }
    
    try {
      const payload = this.jwtService.verify(token);
      console.log(payload);
      const userRole = payload.role;

      
      // Si es ADMIN, puede acceder a todo
      if (userRole === UserRole.ADMIN) {
        return true;
      }
      
      // Si es DEALER, verificar acceso a empresas específicas
      if (userRole === UserRole.DEALER) {
        // Aquí se debería implementar la lógica específica para verificar
        // que el dealer solo acceda a sus empresas asignadas
        // Por ahora permitimos el acceso y la validación específica 
        // se hará en cada servicio
        request['user'] = payload;
        return true;
      }
      
      return false;
    } catch {
      throw new ForbiddenException('Token inválido');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 