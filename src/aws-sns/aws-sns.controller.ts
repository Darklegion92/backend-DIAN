import { Controller, Post, Req, Res, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AwsSnsService } from './aws-sns.service';
import axios from 'axios';

@Controller('aws/sns')
export class AwsSnsController {
  private readonly logger = new Logger(AwsSnsController.name);

  constructor(private readonly awsSnsService: AwsSnsService) {}

  @Post('ses')
  @HttpCode(HttpStatus.OK)
  async handleSesWebhook(@Req() req: Request, @Res() res: Response) {
    let bodyStr: string;

    // SNS sends content as text/plain. Depending on the express middleware, 
    // it might be parsed as an object or stay as a Buffer/string.
    if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
      bodyStr = JSON.stringify(req.body);
    } else if (Buffer.isBuffer(req.body)) {
      bodyStr = req.body.toString('utf-8');
    } else if (typeof req.body === 'string') {
      bodyStr = req.body;
    } else {
      // Handle edge cases where body parser might not have parsed it
      bodyStr = '';
    }

    if (!bodyStr) {
      this.logger.warn('Received empty body from SNS');
      return res.status(HttpStatus.OK).send('Empty body');
    }

    try {
      const payload = JSON.parse(bodyStr);
      
      const messageType = req.headers['x-amz-sns-message-type'] || payload.Type;

      if (messageType === 'SubscriptionConfirmation') {
        const subscribeUrl = payload.SubscribeURL;
        this.logger.log(`Confirming SNS subscription via URL: ${subscribeUrl}`);
        
        try {
          await axios.get(subscribeUrl);
          this.logger.log('SNS subscription confirmed successfully');
        } catch (err) {
          this.logger.error('Failed to confirm SNS subscription', err);
        }

      } else if (messageType === 'Notification') {
        if (payload.Message) {
          await this.awsSnsService.processSesNotification(payload.Message);
        }
      } else {
        this.logger.warn(`Unhandled SNS message type: ${messageType}`);
      }
    } catch (error) {
      this.logger.error('Error parsing SNS payload', error);
    }

    // Always respond 200 OK so SNS doesn't retry infinitely
    res.status(HttpStatus.OK).send('OK');
  }
}
