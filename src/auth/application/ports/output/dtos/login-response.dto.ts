import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@/auth/domain/enums/role.enum';

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  user: {
    id: string;
    email: string;
    role: Role;
  };
} 