import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserController } from './infrastructure/controllers/user.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { GetUsersPaginatedUseCase } from './application/use-cases/get-users-paginated.use-case';
import { GetCurrentUserUseCase } from './application/use-cases/get-current-user.use-case';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { User } from './domain/entities/user.entity';
import { InitService } from './infrastructure/services/init.service';
import { getTypeOrmConfig } from '../config/typeorm.config';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeOrmConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRATION')
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, UserController],
  providers: [
    LoginUseCase,
    LogoutUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserByIdUseCase,
    GetUsersPaginatedUseCase,
    GetCurrentUserUseCase,
    ChangePasswordUseCase,
    InitService,
    JwtStrategy,
    UserRepository,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {}
