import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Observable, firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class InvoiceService {
  private readonly externalServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Obtener la URL del servicio externo desde las variables de entorno
    this.externalServiceUrl = this.configService.get<string>('EXTERNAL_INVOICE_SERVICE_URL') || 'http://localhost:8080/api';
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<any> {
    try {
      // Preparar los headers para la petición
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // Agregar token de autorización si está configurado
      const authToken = this.configService.get<string>('EXTERNAL_SERVICE_TOKEN');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      // Realizar la petición al servicio externo
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.externalServiceUrl}/factura`,
          createInvoiceDto,
          { headers }
        )
      );

      return {
        success: true,
        message: 'Factura creada exitosamente',
        data: response.data,
        statusCode: response.status,
      };

    } catch (error) {
      // Manejo de errores
      if (error.response) {
        // El servidor respondió con un código de estado que no está en el rango 2xx
        throw new HttpException(
          {
            success: false,
            message: 'Error al procesar la factura en el servicio externo',
            error: error.response.data,
            statusCode: error.response.status,
          },
          error.response.status,
        );
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        throw new HttpException(
          {
            success: false,
            message: 'No se pudo conectar con el servicio externo',
            error: 'Timeout o conexión rechazada',
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        // Algo pasó al configurar la petición
        throw new HttpException(
          {
            success: false,
            message: 'Error interno del servidor',
            error: error.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async getInvoiceStatus(invoiceNumber: string): Promise<any> {
    try {
      const headers = {
        'Accept': 'application/json',
      };

      const authToken = this.configService.get<string>('EXTERNAL_SERVICE_TOKEN');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${this.externalServiceUrl}/factura/${invoiceNumber}/status`,
          { headers }
        )
      );

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };

    } catch (error) {
      if (error.response?.status === 404) {
        throw new HttpException(
          {
            success: false,
            message: 'Factura no encontrada',
            error: 'El número de factura no existe',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          success: false,
          message: 'Error al consultar el estado de la factura',
          error: error.response?.data || error.message,
        },
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 