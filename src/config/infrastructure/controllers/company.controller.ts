import {
  Controller,
  Get,
  Post,
  Param,
  Body,
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
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CompanyService } from '../../application/services/company.service';
import { CompanyWithCertificateDto } from '../../application/dto/company-with-certificate.dto';
import { CreateCompanyExternalDto } from '../../application/dto/create-company-external.dto';
import { ExternalCompanyResponseDto } from '../../application/dto/external-company-response.dto';
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
    `,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
    example: 10,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Campo para ordenar',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Dirección del ordenamiento',
    example: 'DESC',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de compañías obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CompanyWithCertificateDto' },
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
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder a las compañías',
  })
  async getCompanies(
    @Query() paginationQuery: PaginationQueryDto,
    @CurrentUser() currentUser: User,
  ): Promise<PaginatedResponseDto<CompanyWithCertificateDto>> {
    return this.companyService.getCompaniesByUserPaginated(
      currentUser,
      paginationQuery,
    );
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
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder a esta compañía',
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
      throw new NotFoundException(
        'Compañía no encontrada o sin permisos para acceder',
      );
    }

    return company;
  }

  @Post('external')
  @ApiOperation({
    summary: 'Crear nueva compañía en servicio externo de la DIAN',
    description: `
      **Registra una nueva empresa en el servicio externo de la DIAN y la guarda localmente.**
      
      Este endpoint realiza las siguientes operaciones:
      1. Valida los datos de entrada según las reglas de la DIAN
      2. Envía la información al servicio externo configurado (EXTERNAL_SERVER_URL)
      3. Si la creación es exitosa, guarda la compañía en la base de datos local
      4. Asocia la compañía al usuario autenticado actual
      5. Retorna la información completa de la compañía con su certificado
      
      **Notas importantes:**
      - El NIT debe ser válido y no estar registrado previamente
      - Todos los IDs de catálogos deben corresponder a valores válidos en la DIAN
      - El correo electrónico debe ser único en el sistema
      - La matrícula mercantil debe ser válida y activa
      
      **Proceso de validación:**
      - Verificación de formato del NIT y dígito de verificación
      - Validación de existencia de códigos en catálogos DIAN
      - Verificación de unicidad de NIT y correo electrónico
      - Validación de datos obligatorios según normativa DIAN
    `,
  })
  @ApiBody({
    type: CreateCompanyExternalDto,
    description: 'Datos de la compañía a registrar en el servicio externo',
    examples: {
      'empresa-ejemplo': {
        summary: 'Ejemplo de empresa S.A.S',
        description: 'Datos típicos para registrar una empresa del sector privado',
        value: {
          nit: '900123456',
          digito: '7',
          type_document_identification_id: 6,
          type_organization_id: 2,
          type_regime_id: 2,
          type_liability_id: 14,
          business_name: 'TECNOLOGÍA Y DESARROLLO S.A.S.',
          merchant_registration: '12345678',
          municipality_id: 149,
          address: 'Carrera 15 #93-47, Oficina 501',
          phone: '+57 1 123 4567',
          email: 'contacto@tecnodesarrollo.com',
        },
      },
      'empresa-retail': {
        summary: 'Ejemplo de empresa comercial',
        description: 'Datos para una empresa del sector comercial/retail',
        value: {
          nit: '800987654',
          digito: '3',
          type_document_identification_id: 6,
          type_organization_id: 1,
          type_regime_id: 1,
          type_liability_id: 14,
          business_name: 'COMERCIALIZADORA DEL CARIBE LTDA',
          merchant_registration: '87654321',
          municipality_id: 149,
          address: 'Calle 72 #10-34, Local 102',
          phone: '+57 5 987 6543',
          email: 'info@comercaribe.co',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Compañía creada exitosamente en el servicio externo y registrada localmente',
    type: CompanyWithCertificateDto,
    schema: {
      example: {
        id: 15,
        identificationNumber: '900123456',
        dv: '7',
        typeDocumentIdentificationId: 6,
        typeOrganizationId: 2,
        languageId: 79,
        taxId: 1,
        typeOperationId: 2,
        typeRegimeId: 2,
        typeLiabilityId: 14,
        municipalityId: 149,
        typeEnvironmentId: 1,
        payrollTypeEnvironmentId: 1,
        eqdocsTypeEnvironmentId: 1,
        address: 'Carrera 15 #93-47, Oficina 501',
        phone: '+57 1 123 4567',
        merchantRegistration: '12345678',
        state: true,
        allowSellerLogin: false,
        soltecUserId: 'user-uuid-here',
        createdAt: '2025-01-21T15:30:00Z',
        updatedAt: '2025-01-21T15:30:00Z',
        certificateExpirationDate: '2026-01-21T23:59:59Z',
        certificateId: 8,
        certificateName: 'certificado_900123456.p12',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o empresa ya registrada',
    schema: {
      example: {
        statusCode: 400,
        message: [
          'El NIT debe contener solo números',
          'El correo electrónico debe ser único',
          'La matrícula mercantil no es válida',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticación requerido o inválido',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token JWT requerido',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para crear compañías',
    schema: {
      example: {
        statusCode: 403,
        message: 'No tiene permisos para crear empresas',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto - NIT o email ya existe en el sistema',
    schema: {
      example: {
        statusCode: 409,
        message: 'Ya existe una empresa con este NIT: 900123456',
        error: 'Conflict',
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Error de validación en el servicio externo de la DIAN',
    schema: {
      example: {
        statusCode: 422,
        message: 'Error de validación en servicio DIAN',
        error: 'Unprocessable Entity',
        details: {
          nit: 'NIT ya registrado en la DIAN',
          municipality_id: 'Código de municipio inválido',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor o falla en comunicación con servicio externo',
    schema: {
      example: {
        statusCode: 500,
        message: 'Error al comunicarse con el servicio externo de la DIAN',
        error: 'Internal Server Error',
      },
    },
  })
  @ApiResponse({
    status: 503,
    description: 'Servicio externo de la DIAN no disponible',
    schema: {
      example: {
        statusCode: 503,
        message: 'Servicio externo temporalmente no disponible',
        error: 'Service Unavailable',
      },
    },
  })
  async createExternalCompany(
    @Body() companyData: CreateCompanyExternalDto,
    @CurrentUser() currentUser: User,
  ): Promise<CompanyWithCertificateDto> {
    return this.companyService.createCompanyInExternalService(
      companyData,
      currentUser,
    );
  }
}
