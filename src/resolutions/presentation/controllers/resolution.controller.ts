import { Controller, Put, Body, UseGuards, HttpStatus, Get, Query, ParseIntPipe, HttpException } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { ResolutionService } from '@/resolutions/application/services/resolution.service';
import { CreateResolutionDto } from '@/resolutions/presentation/dtos/create-resolution.dto';

@ApiTags('Resoluciones')
@Controller('resolution')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ResolutionController {
  constructor(private readonly resolutionService: ResolutionService) {}

  @Put('')
  @ApiOperation({
    summary: 'Crear resolución',
    description: `
      Crea una nueva resolución enviando los datos al servicio externo configurado.
      Solo accesible para ADMIN y DEALER.
      
      El endpoint requiere:
      - Autenticación con Bearer Token (JWT) en el header
      - Datos de la resolución en el body
      - Bearer token para el servicio externo en el body
      
      El bearer token del body se reenvía al servicio externo para autenticación.
      La respuesta del servicio externo se retorna directamente al cliente.
    `,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Resolución creada/actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Resolución creada/actualizada con éxito' },
        resolution: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            type_document_id: { type: 'number', example: 1 },
            resolution: { type: 'string', example: '18760000001' },
            prefix: { type: 'string', example: 'SETP' },
            resolution_date: { type: 'string', example: '2019-01-19' },
            technical_key: { type: 'string', example: 'fc8eac422eba16e22ffd8c6f94b3f40a6e38162c' },
            from: { type: 'number', example: 990000000 },
            to: { type: 'number', example: 995000000 },
            date_from: { type: 'string', example: '2019-01-19' },
            date_to: { type: 'string', example: '2030-01-19' },
            number: { type: 'number', example: 990000000 },
            next_consecutive: { type: 'string', example: 'SETP990000000' },
            created_at: { type: 'string', example: '2025-06-01 21:09:27' },
            updated_at: { type: 'string', example: '2025-06-01 21:09:27' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'El tipo de documento es requerido',
            'El prefijo es requerido',
            'La resolución es requerida',
            'El bearer token es requerido',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor o del servicio externo',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: {
          type: 'string',
          example: 'Error del servicio externo: mensaje de error',
        },
      },
    },
  })
  async createResolution(
    @Body() createResolutionDto: CreateResolutionDto,
  ): Promise<any> {
    return this.resolutionService.createResolution(createResolutionDto);
  }

  @Get('company')
  @ApiOperation({
    summary: 'Obtener resoluciones por empresa',
    description: 'Retorna la lista de resoluciones de una empresa específica con información de tipos de documento relacionados. ADMIN puede ver todas, DEALER solo las que le pertenecen.'
  })
  @ApiQuery({
    name: 'companyId',
    required: true,
    description: 'ID de la empresa',
    example: 1
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página para paginación',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de elementos por página',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de resoluciones obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: {
          data: [
            {
              id: 1,
              companyId: 1,
              typeDocumentId: 1,
              prefix: 'PREF',
              resolution: '18760000001',
              resolutionDate: '2024-01-15',
              technicalKey: 'abc123def456',
              from: 1,
              to: 5000,
              dateFrom: '2024-01-01',
              dateTo: '2024-12-31',
              createdAt: '2024-01-15T10:30:00Z',
              updatedAt: '2024-01-15T10:30:00Z',
              typeDocument: {
                id: 1,
                name: 'Factura Electrónica',
                code: 'FE'
              }
            }
          ],
          meta: {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 1,
            totalPages: 1,
            hasPreviousPage: false,
            hasNextPage: false
          }
        }
      }
    }
  })
  async getResolutionsByCompany(
    @Query('companyId', ParseIntPipe) companyId: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    try {
      const data = await this.resolutionService.getResolutionsByCompany(
        companyId,
        page || 1,
        limit || 10
      );
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('company/nit')
  @ApiOperation({
    summary: 'Obtener resoluciones por NIT de empresa',
    description: 'Retorna la lista de resoluciones de una empresa específica identificada por su NIT. ADMIN puede ver todas, DEALER solo las que le pertenecen.'
  })
  @ApiQuery({
    name: 'nit',
    required: true,
    description: 'NIT de la empresa',
    example: '900123456'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de resoluciones obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          {
            id: 1,
            companyId: 1,
            typeDocumentId: 1,
            prefix: 'PREF',
            resolution: '18760000001',
            resolutionDate: '2024-01-15',
            technicalKey: 'abc123def456',
            from: 1,
            to: 5000,
            dateFrom: '2024-01-01',
            dateTo: '2024-12-31',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            typeDocument: {
              id: 1,
              name: 'Factura Electrónica',
              code: 'FE'
            }
          }
        ]
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
    schema: {
      example: {
        success: false,
        statusCode: 404,
        message: 'Empresa con NIT 900123456 no encontrada'
      }
    }
  })
  async getResolutionsByCompanyNit(
    @Query('nit') nit: string
  ) {
    try {
      const data = await this.resolutionService.getResolutionsByCompanyNit(nit);
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


} 