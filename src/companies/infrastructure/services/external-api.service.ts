import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { UpdateEnvironmentDto } from '../../application/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '../../application/dtos/update-environment-response.dto';
import { IExternalApiService } from '../../domain/services/external-api.service.interface';

@Injectable()
export class ExternalApiService implements IExternalApiService {
  private readonly httpClient: AxiosInstance;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('EXTERNAL_API_BASE_URL', 'https://api.external-service.com');
    
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para logging de requests
    this.httpClient.interceptors.request.use(
      (config) => {
        console.log(`[External API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[External API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Interceptor para manejo de respuestas y errores
    this.httpClient.interceptors.response.use(
      (response) => {
        console.log(`[External API] Response ${response.status}: ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('[External API] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  async updateEnvironment(
    {token, ...updateData}: UpdateEnvironmentDto
  ): Promise<UpdateEnvironmentResponseDto> {
    try {
      const url = `/config/environment`;
      
      const response = await this.httpClient.put(url, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.data) {
        throw new HttpException(
          'No se recibió respuesta del servicio externo',
          HttpStatus.BAD_GATEWAY
        );
      }

      return response.data;

    } catch (error: any) {
      console.error('[External API] Error updating environment:', error);

      if (error.response) {
        // Error de respuesta HTTP
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || 'Error en el servicio externo';
        
        throw new HttpException(
          {
            message: 'Error al actualizar el ambiente de la empresa',
            details: message,
            statusCode: status,
          },
          status >= 400 && status < 500 ? HttpStatus.BAD_REQUEST : HttpStatus.BAD_GATEWAY
        );
      } else if (error.request) {
        // Error de conexión
        throw new HttpException(
          'No se pudo conectar con el servicio externo',
          HttpStatus.SERVICE_UNAVAILABLE
        );
      } else {
        // Error interno
        throw new HttpException(
          'Error interno al procesar la solicitud',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }
} 