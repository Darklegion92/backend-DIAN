import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'admin',
  })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'admin123',
  })
  password: string;
} 