import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Presentation Layer
import { AuthController } from './presentation/controllers/auth.controller';
import { UserController } from './presentation/controllers/user.controller';

// Application Layer
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { GetUsersUseCase } from './application/use-cases/get-users.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetUsersPaginatedUseCase } from './application/use-cases/get-users-paginated.use-case';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';

// Domain Layer
import { User } from './domain/entities/user.entity';
import { UserDian } from './domain/entities/userDian.entity';
import { HostBlockService } from './domain/services/security/host-block.service';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';

// Infrastructure Layer
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { InitService } from './infrastructure/services/init.service';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository';

// External Modules
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    TypeOrmModule.forFeature([User, UserDian]),
  ],
  controllers: [AuthController, UserController],
  providers: [
    // Use Cases
    LoginUseCase,
    LogoutUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUsersUseCase,
    GetUserByIdUseCase,
    GetUsersPaginatedUseCase,
    GetCurrentUserUseCase,
    ChangePasswordUseCase,
    
    // Domain Services
    HostBlockService,
    
    // Infrastructure Services
    JwtStrategy,
    InitService,
    UserRepository,
    
    // Repository Provider
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [HostBlockService, InitService, USER_REPOSITORY],
})
export class AuthModule {} 