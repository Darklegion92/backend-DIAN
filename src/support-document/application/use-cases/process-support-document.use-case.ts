import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DocumentProcessorPort } from '@/document/application/ports/input/document-processor.port';
import { SendDocumentElectronicDto } from '@/document/presentation/dtos/document.dto';
import { SendDocumentElectronicResponse } from '@/document/domain/interfaces/document.interface';
import { DocumentType } from '@/document/domain/enums/document-type.enum';
import { SupportDocumentRequestDto } from '@/support-document/domain/interfaces/support-document.interface';
import { DatabaseUtilsService } from '@/common/infrastructure/services/database-utils.service';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { HttpService } from '@nestjs/axios';
import { CompanyService } from '@/company/application/services/company.service';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { SuccessResponseDto } from '@/credit-note/domain/interfaces';

/**
 * Caso de uso para procesar documentos soporte (Tipo 11)
 * Implementa la interfaz DocumentProcessorPort
 */
@Injectable()
export class ProcessSupportDocumentUseCase implements DocumentProcessorPort {
  private readonly logger = new Logger(ProcessSupportDocumentUseCase.name);
  private readonly externalApiUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) { 
    this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
  }
  /**
   * Procesa un documento soporte
   */
  async process(dto: SendDocumentElectronicDto): Promise<SendDocumentElectronicResponse> {
    this.logger.log('Iniciando procesamiento de documento soporte');
    this.logger.debug('Datos del documento soporte:', {
      number: dto.number,
      nit: dto.nit,
      resolutionNumber: dto.resolutionNumber
    });

    try {
      // TODO: Implementar transformación de datos específica para documentos soporte
      const transformedData = await this.transformSupportDocumentData(dto);

      // TODO: Implementar envío específico a la DIAN para documentos soporte
      const dianResponse = await this.sendSupportDocumentToDian(transformedData,"lol");

      // TODO: Implementar generación de PDF específica para documentos soporte
      const pdfDocument = await this.generateSupportDocumentPdf(dianResponse);

      const response: SendDocumentElectronicResponse = {
        success: true,
        message: 'Documento soporte procesado correctamente',
        data: {
          cufe: dianResponse.cufe,
          date: this.formatDate(new Date()),
          document: pdfDocument
        }
      };

      this.logger.log('Documento soporte procesado exitosamente');
      this.logger.debug('CUFE generado:', dianResponse.cufe);

      return response;

    } catch (error) {
      this.logger.error('Error al procesar documento soporte', error);
      throw error;
    }
  }
  /**
   * TODO: Implementar transformación de datos específica para documentos soporte
   */
  private async transformSupportDocumentData(dto: SendDocumentElectronicDto): Promise<any> {
    // TODO: Transformar datos al formato requerido por la DIAN para documentos soporte
    // - Procesar cadenas de header, detail, taxes, etc.
    // - Aplicar reglas de negocio específicas para documentos soporte
    // - Generar estructura XML/JSON según especificaciones DIAN
    this.logger.debug('Transformando datos para documento soporte - TODO: Implementar');
    
    return {
      // TODO: Retornar estructura de datos transformada
      header: dto.header,
      detail: dto.detail,
      taxes: dto.taxes,
      // ... otros campos transformados
    };
  }

  /**
   * TODO: Implementar envío específico a la DIAN para documentos soporte
   */
  public async sendSupportDocumentToDian(transformedData: SupportDocumentRequestDto, token: string): Promise<any> {
    try {
      this.logger.log('Enviando nota crédito de documento soporte al servicio PHP');
      this.logger.debug('URL del servicio externo:', `${this.externalApiUrl}/sd-credit-note`);

      const response = await firstValueFrom(
        this.httpService.post<SuccessResponseDto>(
          `${this.externalApiUrl}/support-document`,
          transformedData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 120000, // 2 minutos para documento soporte
          }
        )
      );

      this.logger.log('Respuesta exitosa del servicio DIAN');
      return response.data;

    } catch (error) {
      this.logger.error('Error al consumir el servicio externo de documento soporte', { error });

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error en el servicio externo';

        this.logger.error(`Error HTTP ${status}: ${message}`);

        switch (status) {
          case 400:
            throw new HttpException(
              {
                message: 'Datos de nota crédito de documento soporte inválidos',
                details: error.response.data
              },
              HttpStatus.BAD_REQUEST
            );
          case 401:
            throw new HttpException(
              {
                message: 'Error de autenticación con la DIAN',
                details: 'Verifica las credenciales de la DIAN'
              },
              HttpStatus.UNAUTHORIZED
            );
          case 422:
            throw new HttpException(
              {
                message: 'Error de validación de documento soporte',
                details: error.response.data
              },
              HttpStatus.UNPROCESSABLE_ENTITY
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
                message: 'Servicio de la DIAN no disponible',
                details: 'El servicio de la DIAN está temporalmente fuera de servicio'
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

  /**
   * TODO: Implementar generación de PDF específica para documentos soporte
   */
  private async generateSupportDocumentPdf(dianResponse: any): Promise<string> {
    // TODO: Generar PDF específico para documentos soporte
    // - Usar plantilla específica para documentos soporte
    // - Incluir información de autorización DIAN
    // - Aplicar formato y diseño específico
    this.logger.debug('Generando PDF para documento soporte - TODO: Implementar');
    
    // Simulación temporal - retornar PDF base64
    return null;
  }

  /**
   * Formatear fecha para que no supere los 20 caracteres
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
} 