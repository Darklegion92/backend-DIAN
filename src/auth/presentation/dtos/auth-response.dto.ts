import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: {
      id: 'a1b2c3d4-e5f6-7890-ab12-cd34ef567890',
      username: 'admin',
      name: 'Administrador',
      role: 'ADMIN'
    }
  })
  user: {
    id: string;
    username: string;
    name: string;
    role: string;
  };

  @ApiProperty()
  token: string;

  @ApiProperty()
  expiresIn: number;
} 