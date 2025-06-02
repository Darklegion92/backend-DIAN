import { Injectable } from '@nestjs/common';
import { LogoutResponseDto } from '../dtos/logout-response.dto';

@Injectable()
export class LogoutUseCase {
  async execute(): Promise<LogoutResponseDto> {
    // En un sistema JWT stateless, el logout se maneja principalmente en el frontend
    // eliminando el token del localStorage. Sin embargo, aquí podemos implementar
    // lógica adicional como logging, invalidación de refresh tokens, etc.
    
    // Aquí podrías agregar:
    // - Logging del evento de logout
    // - Invalidación de refresh tokens si los usas
    // - Notificaciones de seguridad
    // - Limpieza de sesiones activas
    
    return {
      success: true,
      statusCode: 200,
      timestamp: new Date().toISOString(),
      path: '/auth/logout',
      method: 'POST',
      message: 'Sesión cerrada exitosamente',
    };
  }
} 