import { User } from '../entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByIdWithPassword(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  updatePassword(userId: string, hashedPassword: string): Promise<void>;
} 