import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemController } from './presentation/controllers/system.controller';
import { AppVersionService } from './application/services/app-version.service';
import { AppVersionRepositoryImpl } from './infrastructure/repositories/app-version.repository.impl';
import { AppVersion } from './domain/entities/app-version.entity';

const APP_VERSION_REPOSITORY = 'APP_VERSION_REPOSITORY';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppVersion])
  ],
  controllers: [SystemController],
  providers: [
    AppVersionService,
    {
      provide: APP_VERSION_REPOSITORY,
      useClass: AppVersionRepositoryImpl,
    },
  ],
  exports: [AppVersionService],
})
export class SystemModule {} 