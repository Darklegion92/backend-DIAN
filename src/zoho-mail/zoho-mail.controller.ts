import { Controller, Post, Req, Res, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ZohoMailService } from './zoho-mail.service';

@Controller('zoho/webhooks')
export class ZohoMailController {
  private readonly logger = new Logger(ZohoMailController.name);

  constructor(private readonly zohoMailService: ZohoMailService) {}

  @Post('bounce')
  @HttpCode(HttpStatus.OK)
  async handleZohoWebhook(@Req() req: Request, @Res() res: Response) {
    try {
      const payload = req.body;
      
      if (!payload || !payload.event_name) {
        this.logger.warn('Received empty or invalid payload from Zoho Webhook');
        return res.status(HttpStatus.OK).send('Empty or invalid payload');
      }

      const eventNames: string[] = payload.event_name || [];
      const isBounceOrComplaint = eventNames.some(name => 
        ['hardbounce', 'softbounce', 'fbl_compliant'].includes(name)
      );

      if (isBounceOrComplaint && Array.isArray(payload.event_message)) {
        for (const message of payload.event_message) {
          const bounceAddress = message.bounce_address;
          if (bounceAddress) {
            await this.zohoMailService.blacklistEmail(bounceAddress);
          }
        }
      } else {
        this.logger.log(`Ignoring Zoho webhook event: ${eventNames.join(', ')}`);
      }
    } catch (error) {
      this.logger.error('Error processing Zoho Webhook payload', error);
    }

    // Always respond 200 OK so Zoho doesn't retry infinitely
    res.status(HttpStatus.OK).send('OK');
  }
}
