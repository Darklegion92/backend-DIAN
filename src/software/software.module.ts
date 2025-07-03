import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonModule } from '@/common/common.module';
import { Software } from '@/software/domain/entities/software.entity';
import { SoftwareController } from '@/software/presentation/controllers/software.controller';
import { SoftwareService } from '@/software/application/services/software.service';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    TypeOrmModule.forFeature([Software]),
  ],
  controllers: [SoftwareController],
  providers: [
    SoftwareService,
  ],
  exports: [SoftwareService],
})
export class SoftwareModule {} 