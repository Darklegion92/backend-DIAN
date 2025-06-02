import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Nombre de usuario único',
    example: 'johndoe' 
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ 
    description: 'Correo electrónico del usuario',
    example: 'john.doe@example.com' 
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'password123' 
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Nombre completo del usuario',
    example: 'John Doe' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Rol del usuario en el sistema',
    enum: UserRole, 
    example: UserRole.USER 
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
} 