import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual del usuario',
    example: 'currentPassword123',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña actual es requerida' })
  oldPassword: string;

  @ApiProperty({
    description: 'Nueva contraseña del usuario',
    example: 'newPassword123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'La nueva contraseña es requerida' })
  @MinLength(8, { message: 'La nueva contraseña debe tener al menos 8 caracteres' })
  password: string;
} 