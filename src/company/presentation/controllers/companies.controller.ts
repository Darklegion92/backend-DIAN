import { Controller, Put, Get, Post, Body, Param, Query, UseGuards, ParseIntPipe, NotFoundException, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';

import { UpdateEnvironmentUseCase } from '@/company/application/use-cases/update-environment.use-case';
import { UpdateEnvironmentDto } from '@/company/presentation/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '@/company/presentation/dtos/update-environment-response.dto';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { CompanyService } from '@/company/application/services/company.service';
import { CompanyFilterQueryDto } from '@/company/presentation/dtos/company-filter-query.dto';
import { User } from '@/auth/domain/entities/user.entity';
import { CurrentUser } from '@/auth/presentation/decorators/current-user.decorator';
import { PaginatedResponseDto } from '@/common/presentation/dtos/paginated-response.dto';
import { CompanyWithCertificateDto } from '@/company/presentation/dtos/company-with-certificate.dto';
import { CreateCompanyExternalDto } from '@/company/presentation/dtos/create-company-external.dto';

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

  @Post(':id/icon')
  @ApiOperation({
    summary: 'Actualizar icono de la compañía',
    description: 'Actualiza el icono de la compañía recibiendo la imagen en base64.'
  })
  @HttpCode(204)
  async updateCompanyIcon(
    @Param('id', ParseIntPipe) companyId: number,
    @Body('iconBase64') iconBase64: string
  ): Promise<{ success: boolean; message: string }> {
    return this.companyService.updateCompanyIcon(companyId, iconBase64);
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