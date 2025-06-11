import { Controller, Put, Get, Post, Body, Param, Query, UseGuards, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole, User } from '../../../auth/domain/entities/user.entity';
import { UpdateEnvironmentUseCase } from '../../application/use-cases/update-environment.use-case';
import { UpdateEnvironmentDto } from '../../application/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '../../application/dtos/update-environment-response.dto';
import { CompanyService } from '../../../config/application/services/company.service';
import { CompanyWithCertificateDto } from '../../../config/application/dto/company-with-certificate.dto';
import { CreateCompanyExternalDto } from '../../../config/application/dto/create-company-external.dto';
import { PaginatedResponseDto } from '../../../common/dtos/paginated-response.dto';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { CompanyFilterQueryDto } from '../../../config/application/dto/company-filter-query.dto';

@ApiTags('🏢 Gestión de Empresas')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(
    private readonly updateEnvironmentUseCase: UpdateEnvironmentUseCase,
    private readonly companyService: CompanyService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar compañías con filtro de búsqueda general',
    description: `
      **📋 Obtiene una lista paginada de compañías con filtro de búsqueda general.**
      
      ## 🔐 Control de Acceso por Roles:
      
      ### 👑 **ADMIN** (Administrador del Sistema)
      - ✅ **Acceso Universal**: Puede consultar todas las compañías del sistema
      - 🔓 **Sin Restricciones**: No se limita por usuario asignado
      
      ### 👥 **DEALER/USER** (Usuario Estándar)
      - 🔒 **Acceso Limitado**: Solo compañías asignadas a su usuario
    `,
  })
  @ApiQuery({
    name: 'dato',
    required: false,
    description: 'Filtrar por documento o nombre de la empresa',
    example: '900123456',
  })
  async getCompanies(
    @Query() filterQuery: CompanyFilterQueryDto,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedResponseDto<CompanyWithCertificateDto>> {
    return this.companyService.getCompaniesByUserPaginated(
      currentUser,
      filterQuery,
    );
  }

  @Get('by-nit/:nit')
  @ApiOperation({
    summary: 'Buscar empresa por NIT',
    description: 'Busca una empresa específica por su NIT aplicando filtros de seguridad según el rol',
  })
  async getCompanyByNit(
    @Param('nit') nit: string,
  ): Promise<CompanyWithCertificateDto> {
    if (!nit || !nit.trim()) {
      throw new NotFoundException('El NIT es requerido');
    }

    const nitPattern = /^[0-9]+$/;
    if (!nitPattern.test(nit.trim())) {
      throw new NotFoundException('El NIT debe contener solo números');
    }

    try {
      const company = await this.companyService.getCompanyByNit(nit);

      if (!company) {
        throw new NotFoundException(`No se encontró una empresa con el NIT: ${nit}`);
      }

      return company;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Error al buscar empresa con NIT ${nit}: ${error.message}`);
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener empresa específica',
    description: 'Obtiene una empresa específica. ADMIN puede ver cualquiera, DEALER solo si le pertenece.',
  })
  async getCompanyById(
    @Param('id', ParseIntPipe) companyId: number,
    @CurrentUser() currentUser: User,
  ): Promise<CompanyWithCertificateDto> {
    const company = await this.companyService.getCompanyWithCertificateById(
      companyId,
      currentUser,
    );

    if (!company) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return company;
  }

  @Post()
  @ApiOperation({
    summary: 'Crear nueva empresa',
    description: 'Registra una nueva empresa en el servicio externo de la DIAN y la guarda localmente.',
  })
  async createCompany(
    @Body() companyData: CreateCompanyExternalDto,
    @CurrentUser() currentUser: User,
  ): Promise<CompanyWithCertificateDto> {
    return this.companyService.createCompanyInExternalService(
      companyData,
      currentUser,
    );
  }

  @Put('environment')
  @ApiOperation({
    summary: 'Actualizar ambiente de empresa',
    description: 'Actualiza la configuración del ambiente de una empresa específica.',
  })
  async updateEnvironment(
    @Body() updateEnvironmentDto: UpdateEnvironmentDto,
  ): Promise<UpdateEnvironmentResponseDto> {
    return this.updateEnvironmentUseCase.execute(updateEnvironmentDto);
  }
} 