import { Controller, Put, Body, UseGuards, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { ResolutionService } from '../../application/services/resolution.service';
import { CreateResolutionDto } from '../../application/dto/create-resolution.dto';

@ApiTags('resolution')
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
} 