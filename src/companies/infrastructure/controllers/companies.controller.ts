import { Controller, Put, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { DealerAccessGuard } from '../../../common/guards/dealer-access.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../auth/domain/entities/user.entity';
import { UpdateEnvironmentUseCase } from '../../application/use-cases/update-environment.use-case';
import { UpdateEnvironmentDto } from '../../application/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '../../application/dtos/update-environment-response.dto';

@ApiTags('🏢 Gestión de Empresas')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(
    private readonly updateEnvironmentUseCase: UpdateEnvironmentUseCase,
  ) {}

  @Get()
  @UseGuards(DealerAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  @ApiOperation({
    summary: 'Obtener lista de empresas',
    description: 'Obtiene la lista de empresas. ADMIN puede ver todas, DEALER solo las que le pertenecen.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de empresas obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: 200 },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              identification_number: { type: 'string', example: '901357329' },
              name: { type: 'string', example: 'Empresa Ejemplo' },
              // Más propiedades de la empresa
            }
          }
        }
      }
    }
  })
  async findAll(@Query() query: any): Promise<any> {
    // TODO: Implementar lógica para obtener empresas según el rol
    throw new Error('Método no implementado');
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  @ApiOperation({
    summary: 'Crear una nueva empresa',
    description: 'Crea una nueva empresa. Accesible para ADMIN y DEALER.',
  })
  @ApiResponse({
    status: 201,
    description: 'Empresa creada exitosamente',
  })
  async create(@Body() createCompanyDto: any): Promise<any> {
    // TODO: Implementar lógica para crear empresa
    throw new Error('Método no implementado');
  }

  @Get(':id')
  @UseGuards(DealerAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  @ApiOperation({
    summary: 'Obtener empresa por ID',
    description: 'Obtiene una empresa específica. ADMIN puede ver cualquiera, DEALER solo si le pertenece.',
  })
  @ApiParam({ name: 'id', description: 'ID de la empresa' })
  @ApiResponse({
    status: 200,
    description: 'Empresa encontrada exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
  })
  async findOne(@Param('id') id: string): Promise<any> {
    // TODO: Implementar lógica para obtener empresa por ID con validación de permisos
    throw new Error('Método no implementado');
  }

  @Put('environment')
  @UseGuards(DealerAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  @ApiOperation({
    summary: 'Actualizar ambiente de empresa a producción',
    description: 'Actualiza la configuración del ambiente de una empresa específica. ADMIN puede actualizar cualquiera, DEALER solo si le pertenece.',
  })
  @ApiResponse({
    status: 200,
    description: 'Ambiente actualizado exitosamente',
    type: UpdateEnvironmentResponseDto,
    examples: {
      success: {
        summary: 'Ambiente actualizado exitosamente',
        value: {
          message: 'Ambiente actualizado con éxito',
          company: {
            id: 3,
            user_id: 4,
            identification_number: '901357329',
            dv: '9',
            language_id: 79,
            tax_id: 1,
            type_environment_id: 2,
            payroll_type_environment_id: 2,
            eqdocs_type_environment_id: 2,
            type_operation_id: 10,
            type_document_identification_id: 6,
            country_id: 46,
            type_currency_id: 35,
            type_organization_id: 1,
            type_regime_id: 2,
            type_liability_id: 14,
            municipality_id: 780,
            merchant_registration: '364164',
            address: 'AV 17 7 23 URB TORCOROMA SIGLO XXI',
            phone: '3115634214',
            state: 1,
            created_at: '2025-06-02 07:27:25',
            updated_at: '2025-06-03 13:55:33',
            soltec_user_id: 'f6a9ef9f-a6e5-41cc-82f8-1fc57e96c10e'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/companies/3/environment' },
        method: { type: 'string', example: 'PUT' },
        message: { type: 'string', example: 'Error de validación' },
        error: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['type_environment_id debe ser un número']
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Empresa no encontrada',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 404 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/companies/999/environment' },
        method: { type: 'string', example: 'PUT' },
        message: { type: 'string', example: 'Empresa no encontrada' }
      }
    }
  })
  @ApiResponse({
    status: 502,
    description: 'Error en el servicio externo',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 502 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/companies/3/environment' },
        method: { type: 'string', example: 'PUT' },
        message: { type: 'string', example: 'Error al actualizar el ambiente de la empresa' },
        details: { type: 'string', example: 'No se pudo conectar con el servicio externo' }
      }
    }
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio externo no disponible',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 503 },
        timestamp: { type: 'string', example: '2024-01-15T10:30:00.000Z' },
        path: { type: 'string', example: '/companies/3/environment' },
        method: { type: 'string', example: 'PUT' },
        message: { type: 'string', example: 'No se pudo conectar con el servicio externo' }
      }
    }
  })
  async updateEnvironment(
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ): Promise<UpdateEnvironmentResponseDto> {
    return this.updateEnvironmentUseCase.execute(updateEnvironmentDto);
  }
} 