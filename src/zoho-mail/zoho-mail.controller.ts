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
      
      this.logger.log(`Received Zoho Webhook payload: ${JSON.stringify(payload)}`);
      
      if (!payload || !payload.event_name) {
        this.logger.warn('Received empty or invalid payload from Zoho Webhook');
        return res.status(HttpStatus.OK).send('Empty or invalid payload');
      }

      const eventNames: string[] = Array.isArray(payload.event_name) 
        ? payload.event_name 
        : [payload.event_name];
        
      const isBounceOrComplaint = eventNames.some(name => 
        ['hardbounce', 'softbounce', 'fbl_compliant', 'spam_complaint'].includes(name)
      );

      if (isBounceOrComplaint) {
        let messages: any[] = [];
        
        if (Array.isArray(payload.event_message)) {
          messages = payload.event_message;
        } else if (payload.event_message) {
          messages = [payload.event_message];
        } else {
          messages = [payload];
        }

        for (const message of messages) {
          // Extract the recipient's email address from various possible fields
          const bounceAddress = message.recipient || 
                                message.email_address || 
                                message.email || 
                                message.bounce_address ||
                                message?.event_data?.[0]?.details?.[0]?.bounced_recipient ||
                                message?.email_info?.to?.[0]?.email_address?.address;
                                
          if (bounceAddress) {
            await this.zohoMailService.blacklistEmail(bounceAddress);
          } else {
            this.logger.warn(`Could not extract email address from message: ${JSON.stringify(message)}`);
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
