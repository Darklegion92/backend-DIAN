import { LoginDto as PresentationLoginDto } from '../dtos/login.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { LoginDto as ApplicationLoginDto } from '@/auth/application/ports/input/dtos/login.dto';

/**
 * AuthMapper - Mapea entre DTOs de presentation y application
 * 
 * En arquitectura hexagonal, los mappers de presentation deben:
 * - Convertir DTOs de presentation a DTOs de application
 * - Convertir respuestas de application a DTOs de presentation
 * - NO trabajar directamente con entidades de dominio
 */
export class AuthMapper {
  /**
   * Convierte DTO de login de presentation a DTO de application
   * @param presentationDto - LoginDto de la capa de presentation
   * @returns LoginDto para la capa de application
   */
  static presentationToApplicationLogin(presentationDto: PresentationLoginDto): ApplicationLoginDto {
    return {
      username: presentationDto.username,
      password: presentationDto.password
    };
  }

  /**
   * Convierte respuesta de login de application a DTO de presentation
   * @param loginResponse - Respuesta del caso de uso de login
   * @returns AuthResponseDto para la capa de presentation
   */
  static applicationToPresentationAuth(loginResponse: any): AuthResponseDto {
    return {
      user: {
        id: loginResponse.user.id,
        username: loginResponse.user.username || loginResponse.user.email,
        name: loginResponse.user.name || loginResponse.user.username,
        role: loginResponse.user.role
      },
      token: loginResponse.access_token,
      expiresIn: 3600 // 1 hora en segundos
    };
  }
} 