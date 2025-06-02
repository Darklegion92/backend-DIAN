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

@ApiTags('Empresas')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener lista paginada de compañías con agrupación por rol',
    description: `
      **📋 Consulta compañías con filtrado automático según el rol del usuario:**
      
      ## 🔐 Agrupación por Roles:
      
      ### 👑 **ADMIN** (Administrador del Sistema)
      - ✅ **Acceso Total**: Ve todas las compañías del sistema
      - 📊 **Sin Filtros**: No se aplican restricciones de usuario
      - 🌍 **Vista Global**: Puede gestionar cualquier empresa registrada
      - 📈 **Reportes Completos**: Estadísticas de todo el sistema
      
      ### 👥 **DEALER/USER** (Usuario Estándar)
      - 🔒 **Acceso Restringido**: Solo ve compañías asignadas a su usuario
      - 👤 **Filtro por Usuario**: Filtra por \`company.soltec_user_id = usuario_actual\`
      - 🏢 **Vista Personal**: Solo empresas bajo su gestión
      - 📊 **Reportes Limitados**: Estadísticas de sus empresas únicamente
      
      ## 📊 Estructura de la Respuesta:
      
      **Campos incluidos por compañía:**
      - 🏢 **Información Empresarial**: NIT, razón social, dirección, contacto
      - 📜 **Datos Tributarios**: Régimen, responsabilidades, municipio
      - 🔐 **Configuración**: Ambiente DIAN, configuración SMTP
      - 📄 **Certificado Digital**: ID, nombre, fecha de vencimiento
      - 🔑 **Token DIAN**: Token API para integración con servicios DIAN
      - 👤 **Asignación**: Usuario Soltec responsable de la empresa
      
      ## ⚙️ Ordenamiento y Filtros Disponibles:
      - **Por defecto**: Ordenado por fecha de creación (más recientes primero)
      - **Campos ordenables**: createdAt, updatedAt, identificationNumber, businessName
      - **Paginación**: Configurable con page/limit
    `,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página (por defecto: 1)',
    example: 1,
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página (por defecto: 10, máximo: 100)',
    example: 10,
    schema: { type: 'integer', minimum: 1, maximum: 100 },
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Campo para ordenar los resultados',
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'identificationNumber', 'businessName'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Dirección del ordenamiento',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de compañías obtenida exitosamente con agrupación por rol',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/CompanyWithCertificateDto' },
          description: 'Array de compañías filtradas según el rol del usuario',
        },
        meta: {
          type: 'object',
          properties: {
            currentPage: { 
              type: 'number', 
              example: 1,
              description: 'Página actual en la paginación',
            },
            itemsPerPage: { 
              type: 'number', 
              example: 10,
              description: 'Número de elementos por página',
            },
            totalItems: { 
              type: 'number', 
              example: 25,
              description: 'Total de compañías disponibles para este usuario',
            },
            totalPages: { 
              type: 'number', 
              example: 3,
              description: 'Total de páginas disponibles',
            },
            hasPreviousPage: { 
              type: 'boolean', 
              example: false,
              description: 'Indica si existe una página anterior',
            },
            hasNextPage: { 
              type: 'boolean', 
              example: true,
              description: 'Indica si existe una página siguiente',
            },
          },
        },
      },
      example: {
        data: [
          {
            id: 1,
            identificationNumber: '900123456',
            dv: '7',
            businessName: 'TECNOLOGÍA Y DESARROLLO S.A.S.',
            soltecUserId: 'user-uuid-123',
            certificateId: 8,
            certificateName: 'certificado_900123456.p12',
            tokenDian: 'dian-api-token-xyz',
            createdAt: '2025-01-21T10:30:00Z',
          },
        ],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 5,
          totalPages: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token JWT requerido para acceder a las compañías',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder a las compañías del sistema',
    schema: {
      example: {
        statusCode: 403,
        message: 'No tiene permisos suficientes para consultar compañías',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de consulta inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['page debe ser un número positivo', 'limit no puede ser mayor a 100'],
        error: 'Bad Request',
      },
    },
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
    summary: 'Obtener compañía específica con validación de permisos por rol',
    description: `
      **🔍 Consulta una compañía específica aplicando filtros de seguridad según el rol:**
      
      ## 🔐 Control de Acceso por Roles:
      
      ### 👑 **ADMIN** (Administrador del Sistema)
      - ✅ **Acceso Universal**: Puede consultar cualquier compañía del sistema
      - 🔓 **Sin Restricciones**: No se valida la asignación de usuario
      - 🌍 **Vista Completa**: Acceso a toda la información empresarial
      
      ### 👥 **DEALER/USER** (Usuario Estándar)  
      - 🔒 **Acceso Limitado**: Solo compañías asignadas a su usuario
      - ✋ **Validación Estricta**: Se verifica \`company.soltec_user_id = usuario_actual\`
      - 🚫 **Error 404**: Si intenta acceder a compañía no asignada
      
      ## 📊 Información Incluida en la Respuesta:
      
      **🏢 Datos Empresariales Completos:**
      - **Identificación**: NIT, dígito verificación, razón social
      - **Ubicación**: Dirección, municipio, teléfono, email
      - **Registro**: Matrícula mercantil, fecha de creación
      
      **📜 Configuración Tributaria:**
      - **Régimen**: Tipo de régimen tributario
      - **Responsabilidades**: Responsabilidades fiscales
      - **Ambiente DIAN**: Configuración para facturación electrónica
      
      **🔐 Integración y Seguridad:**
      - **Certificado Digital**: Información del certificado P12
      - **Token DIAN**: Token API para servicios de la DIAN
      - **Configuración SMTP**: Parámetros de correo (si está configurado)
      
      **👤 Gestión:**
      - **Usuario Asignado**: ID del usuario Soltec responsable
      - **Estado**: Activo/Inactivo de la empresa
      - **Permisos**: Configuración de acceso para vendedores
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la compañía a consultar',
    example: 1,
    schema: { type: 'integer', minimum: 1 },
  })
  @ApiResponse({
    status: 200,
    description: 'Compañía encontrada con información completa del certificado y configuración',
    type: CompanyWithCertificateDto,
    schema: {
      example: {
        id: 1,
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
        address: 'Carrera 15 #93-47, Oficina 501',
        phone: '+57 1 123 4567',
        merchantRegistration: '12345678',
        state: true,
        allowSellerLogin: false,
        soltecUserId: 'user-uuid-123',
        createdAt: '2025-01-21T10:30:00Z',
        updatedAt: '2025-01-21T10:30:00Z',
        certificateExpirationDate: '2026-01-21T23:59:59Z',
        certificateId: 8,
        certificateName: 'certificado_900123456.p12',
        tokenDian: 'dian-api-token-xyz',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía no encontrada o sin permisos para acceder',
    schema: {
      example: {
        statusCode: 404,
        message: 'Compañía no encontrada o sin permisos para acceder',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token JWT requerido',
    schema: {
      example: {
        statusCode: 401,
        message: 'Token JWT requerido para acceder a la compañía',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos para acceder a esta compañía específica',
    schema: {
      example: {
        statusCode: 403,
        message: 'No tiene permisos para acceder a esta compañía',
        error: 'Forbidden',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'ID de compañía inválido',
    schema: {
      example: {
        statusCode: 400,
        message: 'El ID debe ser un número entero positivo',
        error: 'Bad Request',
      },
    },
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

  @Post('')
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
