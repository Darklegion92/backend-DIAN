import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../domain/entities/user.entity';

export class UserDataDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp de la respuesta',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta del endpoint',
    example: '/users/currentUser',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP utilizado',
    example: 'GET',
  })
  method: string;

  @ApiProperty({
    description: 'Datos del usuario',
    type: UserDataDto,
  })
  data: UserDataDto;
}

// DTO interno que usan los casos de uso
export class InternalUserResponseDto {
  id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
} 