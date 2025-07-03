import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Certificate } from '@/certificates/domain/entities/certificate.entity';
import { CreateCertificateDto } from '@/certificates/application/ports/input/dtos/create-certificate.dto';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createCertificate(
    createCertificateDto: CreateCertificateDto,
  ): Promise<any> {
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
        certificate: createCertificateDto.certificate,
        password: createCertificateDto.password,
      };

      // Llamar al servicio externo
      const response = await firstValueFrom(
        this.httpService.put(
          `${externalServerUrl}/config/certificate`,
          externalData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${createCertificateDto.bearerToken}`,
            },
          },
        ),
      );

      // Extraer datos de la respuesta del servicio externo
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

  private formatDate(date: Date): string {
    return date.toISOString().replace('T', ' ').substring(0, 19);
  }
} 