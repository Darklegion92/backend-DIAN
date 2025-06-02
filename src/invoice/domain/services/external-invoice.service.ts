import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateInvoiceRequest, CreateInvoiceResponse } from '../entities/invoice.interface';

@Injectable()
export class ExternalInvoiceService {
  private readonly logger = new Logger(ExternalInvoiceService.name);
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

  /**
   * Crear una factura en el servicio externo Laravel
   */
  async createInvoice(invoiceData: CreateInvoiceRequest, token: string): Promise<CreateInvoiceResponse> {
    try {
      this.logger.log('Enviando solicitud de factura al servicio externo');
      this.logger.debug('URL del servicio externo:', `${this.externalApiUrl}/invoice`);
      this.logger.debug('Datos de la factura:', JSON.stringify(invoiceData, null, 2));

      const response = await firstValueFrom(
        this.httpService.post<CreateInvoiceResponse>(
          `${this.externalApiUrl}/invoice`,
          invoiceData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            timeout: 60000,
          },
        ),
      );

      this.logger.log('Respuesta exitosa del servicio externo');
      this.logger.debug('Respuesta completa:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      this.logger.error('Error al consumir el servicio externo de facturas', error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error en el servicio externo';
        
        this.logger.error(`Error HTTP ${status}: ${message}`);
        
        switch (status) {
          case 400:
            throw new HttpException(
              {
                message: 'Datos de factura inválidos',
                details: error.response.data
              },
              HttpStatus.BAD_REQUEST
            );
          case 401:
            throw new HttpException(
              {
                message: 'Token de autenticación inválido',
                details: 'Verifica que el token Bearer sea válido'
              },
              HttpStatus.UNAUTHORIZED
            );
          case 408:
            throw new HttpException(
              {
                message: 'Timeout en el servicio externo',
                details: 'El servicio externo tardó demasiado en responder'
              },
              HttpStatus.REQUEST_TIMEOUT
            );
          case 500:
            throw new HttpException(
              {
                message: 'Error interno del servicio externo',
                details: error.response.data
              },
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          case 503:
            throw new HttpException(
              {
                message: 'Servicio externo no disponible',
                details: 'El servicio externo está temporalmente fuera de servicio'
              },
              HttpStatus.SERVICE_UNAVAILABLE
            );
          default:
            throw new HttpException(
              {
                message: `Error del servicio externo: ${message}`,
                details: error.response.data
              },
              HttpStatus.BAD_GATEWAY
            );
        }
      } else if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          {
            message: 'No se puede conectar al servicio externo',
            details: `Verifica que el servicio esté ejecutándose en: ${this.externalApiUrl}`
          },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      } else if (error.code === 'ETIMEDOUT') {
        throw new HttpException(
          {
            message: 'Timeout de conexión al servicio externo',
            details: 'El servicio externo no respondió en el tiempo esperado'
          },
          HttpStatus.REQUEST_TIMEOUT
        );
      } else {
        throw new HttpException(
          {
            message: 'Error desconocido al comunicarse con el servicio externo',
            details: error.message
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
} 