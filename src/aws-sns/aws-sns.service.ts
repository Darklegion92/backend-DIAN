import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailBlackList } from '../system/domain/entities/email-black-list.entity';

@Injectable()
export class AwsSnsService {
  private readonly logger = new Logger(AwsSnsService.name);

  constructor(
    @InjectRepository(EmailBlackList)
    private readonly emailBlackListRepository: Repository<EmailBlackList>,
  ) {}

  async processSesNotification(messageStr: string): Promise<void> {
    try {
      const message = JSON.parse(messageStr);
      
      if (message.notificationType === 'Bounce') {
        const bouncedRecipients = message.bounce?.bouncedRecipients || [];
        for (const recipient of bouncedRecipients) {
          await this.blacklistEmail(recipient.emailAddress);
        }
      } else if (message.notificationType === 'Complaint') {
        const complainedRecipients = message.complaint?.complainedRecipients || [];
        for (const recipient of complainedRecipients) {
          await this.blacklistEmail(recipient.emailAddress);
        }
      } else {
        this.logger.log(`Ignoring SES notification type: ${message.notificationType}`);
      }
    } catch (error) {
      this.logger.error('Error processing SES notification', error);
    }
  }

  private async blacklistEmail(email: string): Promise<void> {
    if (!email) return;

    try {
      let blacklisted = await this.emailBlackListRepository.findOne({ where: { email } });
      
      if (!blacklisted) {
        blacklisted = this.emailBlackListRepository.create({
          email,
          banned: true,
        });
        await this.emailBlackListRepository.save(blacklisted);
        this.logger.log(`Email added to blacklist: ${email}`);
      } else if (!blacklisted.banned) {
        blacklisted.banned = true;
        await this.emailBlackListRepository.save(blacklisted);
        this.logger.log(`Email banned status updated to true: ${email}`);
      }
    } catch (error) {
      this.logger.error(`Failed to blacklist email: ${email}`, error);
    }
  }
}
