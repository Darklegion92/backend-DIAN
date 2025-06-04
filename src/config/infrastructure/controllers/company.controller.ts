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
import { CompanyFilterQueryDto } from '../../application/dto/company-filter-query.dto';

@ApiTags('Empresas')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

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
      - 🔒 **Acceso Limitado**: Solo compañías asignadas a su usuario (\`company.soltec_user_id = usuario_actual\`)
      
      ## 🔍 Filtro Disponible:
      
      ### 📄 **Búsqueda General:**
      - **\`dato\`**: Busca en NIT o razón social (búsqueda parcial en ambos campos)
      
      ## 📄 Paginación y Ordenamiento:
      - **\`page\`**: Número de página (default: 1)
      - **\`limit\`**: Elementos por página (default: 10, máx: 100)
      - **\`sortBy\`**: Campo de ordenamiento (default: 'createdAt')
      - **\`sortOrder\`**: Dirección (\`ASC\`/\`DESC\`, default: 'DESC')
      
      ## 🎯 Ejemplos de Uso:
      
      **Buscar por NIT:**
      \`GET /companies?dato=900123456\`
      
      **Buscar por razón social:**
      \`GET /companies?dato=tecnología\`
      
      **Con paginación:**
      \`GET /companies?dato=desarrollo&page=1&limit=5\`
    `,
  })
  @ApiQuery({
    name: 'dato',
    required: false,
    description: 'Filtrar por documento o nombre de la empresa',
    example: '900123456',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de compañías con filtros aplicados exitosamente',
    schema: {
      example: {
        data: [
          {
            id: 1,
            identificationNumber: '900123456',
            dv: '7',
            businessName: 'TECNOLOGÍA Y DESARROLLO S.A.S.',
            tradeName: 'TecnoDev',
            email: 'contacto@tecnodev.com',
            state: true,
            certificateExpirationDate: '2025-12-31T23:59:59Z',
            createdAt: '2024-01-15T10:30:00Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetros de filtro inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['page debe ser un número positivo', 'limit no puede ser mayor a 100'],
        error: 'Bad Request',
      },
    },
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
        updatedAt: '2025-01-21T15:45:00Z',
        businessName: 'TECNOLOGÍA Y DESARROLLO S.A.S.',
        tradeName: 'TecnoDev',
        email: 'contacto@tecnodev.com',
        seze: 'SEZE123456',
        headNote: 'Gracias por su compra',
        footNote: 'Política de devoluciones disponible',
        typeDocumentIdentification: 'NIT',
        typeOrganization: 'Persona Jurídica',
        typeLiability: 'Responsable de IVA',
        typeRegime: 'Régimen Común',
        municipality: 'Bogotá D.C., Bogotá D.C.',
        typeEnvironment: 'Producción',
        certificatePassword: '***',
        certificateExpirationDate: '2025-12-31T23:59:59Z',
        soltecUser: {
          name: 'Juan Pérez',
          email: 'juan.perez@soltec.com'
        }
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía no encontrada o sin permisos de acceso',
    schema: {
      example: {
        statusCode: 404,
        message: 'Compañía no encontrada',
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
      throw new NotFoundException('Compañía no encontrada');
    }

    return company;
  }

  @Get('by-nit/:nit')
  @ApiOperation({
    summary: 'Buscar compañía por NIT con control de acceso por roles',
    description: `
      **🔍 Busca una compañía específica por su NIT aplicando filtros de seguridad según el rol:**
      
      ## 🔐 Control de Acceso por Roles:
      
      ### 👑 **ADMIN** (Administrador del Sistema)
      - ✅ **Acceso Universal**: Puede buscar cualquier compañía por NIT en todo el sistema
      - 🔓 **Sin Restricciones**: No se valida la asignación de usuario
      - 🌍 **Vista Completa**: Acceso a toda la información empresarial
      
      ### 👥 **DEALER/USER** (Usuario Estándar)  
      - 🔒 **Acceso Limitado**: Solo puede buscar compañías asignadas a su usuario
      - ✋ **Validación Estricta**: Se verifica \`company.soltec_user_id = usuario_actual\`
      - 🚫 **Error 404**: Si el NIT no corresponde a una compañía asignada al usuario
      
      ## 🎯 Casos de Uso:
      
      **📋 Validación de NIT:**
      - Verificar si una compañía existe en el sistema antes de crear documentos
      - Obtener información completa de una empresa para integración con ERPs
      
      **🔄 Integración con Sistemas Externos:**
      - APIs de terceros que necesitan consultar compañías por NIT
      - Servicios de validación de datos empresariales
      
      **📊 Reportes y Consultas:**
      - Generar reportes específicos por empresa
      - Consultas rápidas para soporte técnico
      
      ## 📋 Formato del NIT:
      - **Sin dígito verificador**: Solo números del NIT
      - **Ejemplo válido**: \`900123456\`
      - **Se elimina automáticamente**: Espacios en blanco al inicio y final
    `,
  })
  @ApiParam({
    name: 'nit',
    description: 'NIT de la compañía a buscar (sin dígito verificador)',
    example: '900123456',
    schema: { type: 'string', pattern: '^[0-9]+$' },
  })
  @ApiResponse({
    status: 200,
    description: 'Compañía encontrada exitosamente con información completa',
    type: CompanyWithCertificateDto,
    schema: {
      example: {
        id: 1,
        identificationNumber: '900123456',
        dv: '7',
        businessName: 'TECNOLOGÍA Y DESARROLLO S.A.S.',
        tradeName: 'TecnoDev',
        email: 'contacto@tecnodev.com',
        phone: '+57 1 123 4567',
        address: 'Carrera 15 #93-47, Oficina 501',
        merchantRegistration: '12345678',
        state: true,
        allowSellerLogin: false,
        soltecUserId: 'user-uuid-123',
        typeDocumentIdentificationId: 6,
        typeOrganizationId: 2,
        typeLiabilityId: 14,
        typeRegimeId: 2,
        municipalityId: 149,
        typeEnvironmentId: 1,
        createdAt: '2025-01-21T10:30:00Z',
        updatedAt: '2025-01-21T15:45:00Z',
        typeDocumentIdentification: 'NIT',
        typeOrganization: 'Persona Jurídica',
        typeLiability: 'Responsable de IVA',
        typeRegime: 'Régimen Común',
        municipality: 'Bogotá D.C., Bogotá D.C.',
        typeEnvironment: 'Producción',
        certificatePassword: '***',
        certificateExpirationDate: '2025-12-31T23:59:59Z',
        soltecUser: {
          name: 'Juan Pérez',
          email: 'juan.perez@soltec.com'
        }
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Compañía no encontrada con el NIT proporcionado o sin permisos de acceso',
    schema: {
      example: {
        statusCode: 404,
        message: 'No se encontró una compañía con el NIT: 900123456',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'NIT inválido o vacío',
    schema: {
      example: {
        statusCode: 400,
        message: 'El NIT es requerido y debe contener solo números',
        error: 'Bad Request',
      },
    },
  })
  async getCompanyByNit(
    @Param('nit') nit: string,
    @CurrentUser() currentUser: User,
  ): Promise<CompanyWithCertificateDto> {
    // Validación del formato del NIT
    if (!nit || !nit.trim()) {
      throw new NotFoundException('El NIT es requerido');
    }

    // Validar que el NIT contenga solo números
    const nitPattern = /^[0-9]+$/;
    if (!nitPattern.test(nit.trim())) {
      throw new NotFoundException('El NIT debe contener solo números');
    }

    try {
      const company = await this.companyService.getCompanyByNit(nit, currentUser);

      if (!company) {
        throw new NotFoundException(`No se encontró una compañía con el NIT: ${nit}`);
      }

      return company;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new NotFoundException(`Error al buscar compañía con NIT ${nit}: ${error.message}`);
    }
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
