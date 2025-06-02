import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CompanyService } from '../../application/services/company.service';
import { CompanyWithCertificateDto } from '../../application/dto/company-with-certificate.dto';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dtos/paginated-response.dto';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { User } from '../../../auth/domain/entities/user.entity';

@ApiTags('companies')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener lista paginada de compañías por usuario',
    description: `
      Consulta las compañías según el rol del usuario con paginación:
      - ADMIN: Obtiene todas las compañías del sistema
      - DEALER/USER: Solo obtiene las compañías asignadas a su usuario
      
      La respuesta incluye todos los campos de la compañía y la información del certificado asociado.
    `
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', example: 10 })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Campo para ordenar', example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Dirección del ordenamiento', example: 'DESC' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de compañías obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CompanyWithCertificateDto' }
        },
        meta: {
          type: 'object',
          properties: {
            currentPage: { type: 'number', example: 1 },
            itemsPerPage: { type: 'number', example: 10 },
            totalItems: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 },
            hasPreviousPage: { type: 'boolean', example: false },
            hasNextPage: { type: 'boolean', example: true },
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos para acceder a las compañías' })
  async getCompanies(
    @Query() paginationQuery: PaginationQueryDto,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedResponseDto<CompanyWithCertificateDto>> {
    return this.companyService.getCompaniesByUserPaginated(currentUser, paginationQuery);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una compañía específica por ID',
    description: `
      Consulta una compañía específica según el rol del usuario:
      - ADMIN: Puede acceder a cualquier compañía
      - DEALER/USER: Solo puede acceder a compañías asignadas a su usuario
      
      La respuesta incluye todos los campos de la compañía y la información del certificado asociado.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la compañía',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Compañía encontrada con información del certificado',
    type: CompanyWithCertificateDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía no encontrada o sin permisos para acceder',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
  })
  @ApiResponse({ status: 403, description: 'Sin permisos para acceder a esta compañía' })
  async getCompanyById(
    @Param('id', ParseIntPipe) companyId: number,
    @CurrentUser() currentUser: User,
  ): Promise<CompanyWithCertificateDto> {
    const company = await this.companyService.getCompanyWithCertificateById(
      companyId,
      currentUser,
    );

    if (!company) {
      throw new NotFoundException(
        'Compañía no encontrada o sin permisos para acceder',
      );
    }

    return company;
  }
} 