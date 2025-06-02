import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginDto } from '../../application/dtos/login.dto';
import { LoginResponseDto } from '../../application/dtos/login-response.dto';
import { InternalLoginDataDto } from '../../application/dtos/login-data.dto';

@ApiTags('🔐 Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve un token JWT para acceder a los endpoints protegidos.',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso - Devuelve token JWT y datos del usuario',
    type: LoginResponseDto,
    examples: {
      success: {
        summary: 'Login exitoso',
        value: {
          success: true,
          statusCode: 200,
          timestamp: '2024-01-15T10:30:00.000Z',
          path: '/auth/login',
          method: 'POST',
          data: {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              id: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
              email: 'usuario@ejemplo.com',
              role: 'USER'
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Credenciales inválidas',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 401 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/auth/login' },
        method: { type: 'string', example: 'POST' },
        message: { type: 'string', example: 'Credenciales inválidas' }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/auth/login' },
        method: { type: 'string', example: 'POST' },
        message: { type: 'string', example: 'Error de validación' },
        error: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['username should not be empty', 'password should not be empty']
        }
      }
    }
  })
  async login(@Body() loginDto: LoginDto): Promise<InternalLoginDataDto> {
    return this.loginUseCase.execute(loginDto);
  }
} 