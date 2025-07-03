import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { CreateResolutionDto } from '@/resolutions/presentation/dtos/create-resolution.dto';
import { Software } from '@/software/domain/entities/software.entity';
import { Resolution } from '@/resolutions/domain/entities/resolution.entity';

interface NumberRangeResponse {
  ResolutionNumber: string;
  ResolutionDate: string;
  Prefix: string;
  FromNumber: string;
  ToNumber: string;
  ValidDateFrom: string;
  ValidDateTo: string;
  TechnicalKey?: string | { _attributes: { nil: string } };
}

interface NumberingRangeApiResponse {
  message: string;
  ResponseDian: {
    Envelope: {
      Body: {
        GetNumberingRangeResponse: {
          GetNumberingRangeResult: {
            OperationCode: string;
            OperationDescription: string;
            ResponseList: {
              NumberRangeResponse: NumberRangeResponse[];
            };
          };
        };
      };
    };
  };
  certificate_days_left: number;
}

interface ExternalInvoiceData {
  type_document_id: number;
  prefix: string;
  resolution: string;
  resolution_date?: string;
  technical_key?: string;
  from: string;
  to: string;
  generated_to_date?: number;
  date_from?: string;
  date_to?: string;
}

@Injectable()
export class ResolutionService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(Software)
    private readonly softwareRepository: Repository<Software>,
    @InjectRepository(Resolution)
    private readonly resolutionRepository: Repository<Resolution>,
  ) {}

  private async getResolutionDian(
    companyId: number,
    resolution: string,
    prefix: string,
    bearerToken: string,
  ): Promise<NumberRangeResponse | null> {
    try {
      // Buscar el software por company_id
      const software = await this.softwareRepository.findOne({
        where: { companyId },
      });

      if (!software) {
        throw new HttpException(
          'Software no encontrado para la empresa',
          HttpStatus.NOT_FOUND,
        );
      }

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

      // Consultar el servicio /numbering-range
      const response = await firstValueFrom(
        this.httpService.post<NumberingRangeApiResponse>(
          `${externalServerUrl}/numbering-range`,
          {
            IDSoftware: software.identifier,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${bearerToken}`,
            },
          },
        ),
      );

      // Buscar la technical_key en la respuesta
      const numberRangeResponses =
        response.data.ResponseDian.Envelope.Body.GetNumberingRangeResponse
          .GetNumberingRangeResult.ResponseList.NumberRangeResponse;

      const matchingRange = numberRangeResponses.find(
        (range) =>
          range.ResolutionNumber === resolution && range.Prefix === prefix,
      );

      if (matchingRange) {
          return matchingRange;
      }

      return null;
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Error al consultar technical_key: ${error.response.data?.message || error.message}`,
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'Error al consultar technical_key',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createResolution(
    createResolutionDto: CreateResolutionDto,
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

      const externalData = await this.generateExternalData(createResolutionDto);

    

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

  private async generateExternalData(createResolutionDto: CreateResolutionDto):Promise<ExternalInvoiceData> {


    if(createResolutionDto.prefix === 'SETP' && [1,3].includes(createResolutionDto.type_document_id)) {
      return {
        type_document_id: 1,
        prefix: 'SETP',
        resolution: '18760000001',
        resolution_date: '2019-01-19',
        technical_key: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c',
        from: '990000000',
        to: '995000000',
        generated_to_date: 0,
        date_from: '2019-01-19',
        date_to: '2030-01-19',
      };
    }

    if(createResolutionDto.prefix === 'SEDS' && createResolutionDto.type_document_id === 11) {
      return {
        type_document_id: 11,
        prefix: 'SEDS',
        resolution: '18760000001',
        resolution_date: '2022-01-01',
        from: '984000000',
        to: '985000000',
        generated_to_date: 0,
        date_from: '2022-01-01',
        date_to: '2022-12-31',
      }
    }

    if([4,5,9,10,13].includes(createResolutionDto.type_document_id)) {
      return {
        type_document_id: 4,
        prefix: createResolutionDto.prefix,
        resolution: '1',
        from: '1',
        to: '999999999',
      }   

    }


    const resolutionDian = await this.getResolutionDian(
      createResolutionDto.company_id,
      createResolutionDto.resolution,
      createResolutionDto.prefix,
      createResolutionDto.bearerToken,
    );

    if(!resolutionDian) {
      throw new HttpException(
        'No se encontró la resolución en la Dian',
        HttpStatus.NOT_FOUND,
      );
    }

    let technical_key: string;
    if(typeof resolutionDian.TechnicalKey === 'string') {
      technical_key = resolutionDian.TechnicalKey;
    } else {
      technical_key = null;
    }

    
    return {
      type_document_id: createResolutionDto.type_document_id,
      prefix: createResolutionDto.prefix,
      resolution: createResolutionDto.resolution,
      resolution_date: resolutionDian.ResolutionDate,
      technical_key: technical_key,
      from: resolutionDian.FromNumber,
      to: resolutionDian.ToNumber,
      generated_to_date: 0,
      date_from: resolutionDian.ValidDateFrom,
      date_to: resolutionDian.ValidDateTo,
    }
  }

  /**
   * Obtener resoluciones por empresa con paginación
   */
  async getResolutionsByCompany(companyId: number, page: number = 1, limit: number = 10) {
    try {
      // Validar parámetros
      const pageNumber = Math.max(1, page);
      const limitNumber = Math.max(1, Math.min(100, limit)); // máximo 100 elementos
      const offset = (pageNumber - 1) * limitNumber;

      // Consultar resoluciones con relaciones, especificando los campos explícitamente
      const queryBuilder = this.resolutionRepository
        .createQueryBuilder('resolution')
        .leftJoinAndSelect('resolution.typeDocument', 'typeDocument')
        .select([
          'resolution.id',
          'resolution.companyId',
          'resolution.typeDocumentId', 
          'resolution.prefix',
          'resolution.resolution',
          'resolution.resolutionDate',
          'resolution.technicalKey',
          'resolution.from',
          'resolution.to',
          'resolution.dateFrom',
          'resolution.dateTo',
          'resolution.createdAt',
          'resolution.updatedAt',
          'typeDocument.id',
          'typeDocument.name'
        ])
        .where('resolution.companyId = :companyId', { companyId })
        .orderBy('resolution.createdAt', 'DESC')
        .skip(offset)
        .take(limitNumber);

      // Obtener datos y total
      const [resolutions, totalItems] = await queryBuilder.getManyAndCount();
        console.log("resolutions", resolutions);
        
      // Calcular metadatos de paginación
      const totalPages = Math.ceil(totalItems / limitNumber);
      const hasPreviousPage = pageNumber > 1;
      const hasNextPage = pageNumber < totalPages;

      return {
        data: resolutions,
        meta: {
          currentPage: pageNumber,
          itemsPerPage: limitNumber,
          totalItems,
          totalPages,
          hasPreviousPage,
          hasNextPage
        }
      };
    } catch (error) {
      console.error('Error en getResolutionsByCompany:', error);
      throw new HttpException(
        'Error al obtener las resoluciones',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtener resoluciones por NIT de empresa sin paginación
   */
  async getResolutionsByCompanyNit(nit: string) {
    try {
      // Consultar resoluciones con relaciones a través del NIT
      const queryBuilder = this.resolutionRepository
        .createQueryBuilder('resolution')
        .leftJoinAndSelect('resolution.typeDocument', 'typeDocument')
        .leftJoinAndSelect('resolution.company', 'company')
        .select([
          'resolution.id',
          'resolution.companyId',
          'resolution.typeDocumentId', 
          'resolution.prefix',
          'resolution.resolution',
          'resolution.resolutionDate',
          'resolution.technicalKey',
          'resolution.from',
          'resolution.to',
          'resolution.dateFrom',
          'resolution.dateTo',
          'resolution.createdAt',
          'resolution.updatedAt',
          'typeDocument.id',
          'typeDocument.name',
          'company.id',
          'company.identificationNumber'
        ])
        .where('company.identificationNumber = :nit', { nit })
        .orderBy('resolution.typeDocumentId', 'ASC')
        .addOrderBy('resolution.prefix', 'ASC');

      // Obtener todas las resoluciones sin paginación
      const resolutions = await queryBuilder.getMany();

      return {
        data: resolutions
      };
    } catch (error) {
      console.error('Error en getResolutionsByCompanyNit:', error);
      throw new HttpException(
        'Error al obtener las resoluciones por NIT',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 