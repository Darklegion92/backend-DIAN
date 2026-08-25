import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailBlackList } from '../system/domain/entities/email-black-list.entity';

@Injectable()
export class ZohoMailService {
  private readonly logger = new Logger(ZohoMailService.name);

  constructor(
    @InjectRepository(EmailBlackList)
    private readonly emailBlackListRepository: Repository<EmailBlackList>,
  ) {}

  async blacklistEmail(email: string): Promise<void> {
    if (!email) return;

    try {
      let blacklisted = await this.emailBlackListRepository.findOne({ where: { email } });
      
      if (!blacklisted) {
        blacklisted = this.emailBlackListRepository.create({
          email,
          banned: true,
        });
        await this.emailBlackListRepository.save(blacklisted);
        this.logger.log(`Email added to blacklist via Zoho Webhook: ${email}`);
      } else if (!blacklisted.banned) {
        blacklisted.banned = true;
        await this.emailBlackListRepository.save(blacklisted);
        this.logger.log(`Email banned status updated to true via Zoho Webhook: ${email}`);
      }
    } catch (error) {
      this.logger.error(`Failed to blacklist email: ${email}`, error);
    }
  }
}
