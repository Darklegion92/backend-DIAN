import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZohoMailController } from './zoho-mail.controller';
import { ZohoMailService } from './zoho-mail.service';
import { EmailBlackList } from '../system/domain/entities/email-black-list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmailBlackList])],
  controllers: [ZohoMailController],
  providers: [ZohoMailService],
  exports: [ZohoMailService],
})
export class ZohoMailModule {}
