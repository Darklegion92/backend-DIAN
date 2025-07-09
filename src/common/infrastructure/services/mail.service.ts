import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import {
  SendMailRequest,
  SendMailResponse,
} from '@/common/domain/interfaces/mail.interface';

@Injectable()
export class MailService {
  private readonly externalApiUrl: string;

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    this.externalApiUrl = this.configService.get('EXTERNAL_SERVER_URL');
  }
  async sendMailWithCompanyConfig(
    {token,...data}: SendMailRequest,
  ): Promise<SendMailResponse> {

    const response = await firstValueFrom(
      this.httpService.post<SendMailResponse>(`${this.externalApiUrl}/send-email`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 60000,
      }),
    );

    return response.data;
  }
} 