import { UserRole } from '../../domain/entities/user.entity';

export class InternalUserDataDto {
  id: string;
  email: string;
  role: UserRole;
}

export class InternalLoginDataDto {
  access_token: string;
  user: InternalUserDataDto;
} 