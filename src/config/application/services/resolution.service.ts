import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateResolutionDto } from '../dto/create-resolution.dto';

@Injectable()
export class ResolutionService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createResolution(createResolutionDto: CreateResolutionDto): Promise<any> {
    try {
      // Obtener la URL del servicio externo
      const externalServerUrl = this.configService.get<string>(
        'EXTERNAL_SERVER_URL',
      );

      if (!externalServerUrl) {
        throw new HttpException(
          'URL del servidor externo no configurada',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Preparar los datos para el servicio externo (excluyendo bearerToken del body)
      const externalData = {
        type_document_id: createResolutionDto.type_document_id,
        prefix: createResolutionDto.prefix,
        resolution: createResolutionDto.resolution,
        resolution_date: createResolutionDto.resolution_date,
        technical_key: createResolutionDto.technical_key,
        from: createResolutionDto.from,
        to: createResolutionDto.to,
        generated_to_date: createResolutionDto.generated_to_date,
        date_from: createResolutionDto.date_from,
        date_to: createResolutionDto.date_to,
      };

      // Llamar al servicio externo
      const response = await firstValueFrom(
        this.httpService.put(
          `${externalServerUrl}/config/resolution`,
          externalData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${createResolutionDto.bearerToken}`,
            },
          },
        ),
      );

      // Retornar la respuesta del servicio externo directamente
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Error del servicio externo: ${error.response.data?.message || error.message}`,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 