import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../domain/entities/user.entity';

export class UserResponseDto {
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
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'John Doe',
  })
  name: string;

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