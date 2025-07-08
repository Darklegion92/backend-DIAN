import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { soapLogger } from './logger.service';

interface ExternalXmlResponse {
  success: boolean;
  message: string;
  filebase64?: string;
}

@Injectable()
export class XmlDownloaderService {
  private readonly externalApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
    if (!this.externalApiUrl) {
      throw new Error('EXTERNAL_SERVER_URL no está configurada en las variables de entorno');
    }
  }

  async downloadBase64Xml(
    companyNit: string,
    documentNumber: string,
    requestId: string,
    tokenDian: string,
  ): Promise<ExternalXmlResponse> {
    const xmlUrl = `${this.externalApiUrl}/download/${companyNit}/Attachment-${documentNumber}.xml/BASE64`;
    soapLogger.info(`Consultando XML desde ${xmlUrl}`, { requestId });

    try {
      const response = await firstValueFrom(
        this.httpService.get<ExternalXmlResponse>(xmlUrl, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${tokenDian}`,
          },
          timeout: 30000,
        }),
      );
      return response.data;
    } catch (error) {
      soapLogger.error('Error al intentar conectar con el servicio externo para obtener XML', {
        requestId,
        url: xmlUrl,
        error: error.message,
      });
      // Devolvemos un objeto consistente con la respuesta esperada en caso de error de conexión
      return {
        success: false,
        message: `No se pudo comunicar con el servicio externo para obtener el adjunto: ${error.message}`,
      };
    }
  }
} 