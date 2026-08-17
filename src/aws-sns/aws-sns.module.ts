import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsSnsController } from './aws-sns.controller';
import { AwsSnsService } from './aws-sns.service';
import { EmailBlackList } from '../system/domain/entities/email-black-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailBlackList])],
  controllers: [AwsSnsController],
  providers: [AwsSnsService],
  exports: [AwsSnsService],
})
export class AwsSnsModule {}
