import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ 
    description: 'Nombre de usuario único',
    example: 'johndoe', 
    required: false 
  })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'john.doe@example.com', 
    required: false 
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123', 
    required: false 
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'John Doe', 
    required: false 
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    description: 'Rol del usuario en el sistema',
    enum: UserRole, 
    example: UserRole.USER, 
    required: false 
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
} 