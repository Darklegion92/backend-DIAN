import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Resolution } from '@/resolutions/domain/entities/resolution.entity';
import { ResolutionController } from '@/resolutions/presentation/controllers/resolution.controller';
import { CommonModule } from '@/common/common.module';
import { Software } from '@/software/domain/entities/software.entity';
import { ResolutionService } from '@/resolutions/application/services/resolution.service';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    TypeOrmModule.forFeature([Resolution, Software]),
  ],
  controllers: [ResolutionController],
  providers: [
    ResolutionService,
  ],
  exports: [ResolutionService],
})
export class ResolutionsModule {} 