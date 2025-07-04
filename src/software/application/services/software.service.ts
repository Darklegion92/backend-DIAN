import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CreateSoftwareDto } from '@/software/presentation/dtos/create-software.dto';
import { SoftwareResponseDto } from '@/software/presentation/dtos/software-response.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SoftwareService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createSoftware({
    token,
    type_software,
    ...createSoftwareDto
  }: CreateSoftwareDto): Promise<SoftwareResponseDto> {
    try {
      const externalServerUrl = this.configService.get<string>(
        'EXTERNAL_SERVER_URL',
      );

      if (!externalServerUrl) {
        throw new Error(
          'EXTERNAL_SERVER_URL no está configurada en las variables de entorno',
        );
      }

      let url = `${externalServerUrl}/config/software`;
      let data: any = createSoftwareDto;

      if (type_software === 'payroll') {
        url = `${externalServerUrl}/config/softwarepayroll`;
        data = {
          idpayroll: createSoftwareDto.id,
          pinpayroll: createSoftwareDto.pin,
        };
      }

      const response = await firstValueFrom(
        this.httpService.put<SoftwareResponseDto>(url, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }),
      );

      // Verificar que la respuesta sea exitosa
      if (!response.data.success) {
        throw new Error(`Error del servicio externo: ${response.data.message}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error al crear software en servicio externo:', error);
      
      // Si la respuesta del servidor externo tiene datos de error estructurados
      if (error.response?.data) {
        const errorData = error.response.data;
        throw new Error(
          `Error del servicio externo: ${errorData.message || 'Error desconocido'}`,
        );
      }

      // Error genérico si no tiene la estructura esperada
      throw new Error(
        `Error al crear software en servicio externo: ${error.message}`,
      );
    }
  }
} 