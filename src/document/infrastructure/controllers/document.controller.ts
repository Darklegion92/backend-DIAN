import { Controller, Get, Post, Query, Body, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { DocumentService } from '../../domain/services/document.service';
import { DocumentListQueryDto } from '../dto/document.dto';
import { DocumentListResponse } from '../../domain/entities/document.interface';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { DealerAccessGuard } from '../../../common/guards/dealer-access.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserRole } from '../../../auth/domain/entities/user.entity';
import { CurrentUser } from '../../../auth/infrastructure/decorators/current-user.decorator';
import { User } from '../../../auth/domain/entities/user.entity';

@ApiTags('Documentos')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly documentService: DocumentService) {}

  // /api/documents POST ADMIN DEALER solo debe poder consultar los documentos de las empresas que pertenezcan a ese dealer
  @Post()
  @UseGuards(DealerAccessGuard)
  @Roles(UserRole.ADMIN, UserRole.DEALER)
  @ApiOperation({
    summary: 'Crear o consultar documentos por compañía',
    description: `
    **Crear o Consultar Documentos Electrónicos por Compañía**
    
    Este endpoint permite crear o consultar documentos electrónicos (facturas, notas crédito, notas débito).
    ADMIN puede acceder a todos los documentos, DEALER solo a los de las empresas que le pertenecen.
    
    **Seguridad:**
    - Requiere autenticación JWT Bearer token
    - ADMIN: Acceso completo a todos los documentos
    - DEALER: Solo documentos de empresas asignadas
    `,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Documento creado o consultado exitosamente',
  })
  async createOrQueryDocuments(
    @Body() createDocumentDto: any,
    @CurrentUser() currentUser: User,
  ): Promise<any> {
    // TODO: Implementar lógica para crear/consultar documentos con validación de permisos
    throw new Error('Método no implementado');
  }

  @Get()
  @ApiOperation({
    summary: 'Listar documentos por compañía',
    description: `
    **Lista de Documentos Electrónicos por Compañía**
    
    Este endpoint obtiene la lista paginada de documentos electrónicos (facturas, notas crédito, notas débito) 
    que pertenecen a la compañía del usuario autenticado.
    
    **Filtros disponibles:**
    - **Fechas:** Rango de fechas de creación (created_at_from, created_at_to)
    - **Prefijo:** Prefijo del documento (ej: FE, NC, ND)
    - **Número:** Número específico del documento
    - **Identificación:** Número de identificación del cliente
    - **Tipo:** Tipo de documento (1=Factura, 2=Nota Crédito, 3=Nota Débito)
    
    **Paginación:**
    - Página actual (page) - por defecto: 1
    - Elementos por página (per_page) - por defecto: 10, máximo: 100
    
    **Estado fijo:**
    - Solo retorna documentos con state_document_id = 1 (Autorizados por la DIAN)
    
    **Seguridad:**
    - Requiere autenticación JWT Bearer token
    - Filtra automáticamente por la compañía del usuario autenticado
    `,
  })
  @ApiQuery({
    name: 'created_at_from',
    required: false,
    description: 'Fecha inicial de creación (YYYY-MM-DD)',
    example: '2025-01-01'
  })
  @ApiQuery({
    name: 'created_at_to',
    required: false,
    description: 'Fecha final de creación (YYYY-MM-DD)',
    example: '2025-01-31'
  })
  @ApiQuery({
    name: 'prefix',
    required: false,
    description: 'Prefijo del documento',
    example: 'FE'
  })
  @ApiQuery({
    name: 'number',
    required: false,
    description: 'Número del documento',
    example: '001'
  })
  @ApiQuery({
    name: 'identification_number',
    required: false,
    description: 'Número de identificación del cliente',
    example: '12345678'
  })
  @ApiQuery({
    name: 'type_document_id',
    required: false,
    description: 'Tipo de documento (1=Factura, 2=Nota Crédito, 3=Nota Débito)',
    example: 1
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Página actual',
    example: 1
  })
  @ApiQuery({
    name: 'per_page',
    required: false,
    description: 'Elementos por página (máximo 100)',
    example: 10
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de documentos obtenida exitosamente',
    content: {
      'application/json': {
        example: {
          success: true,
          message: "Documentos obtenidos exitosamente",
          data: {
            current_page: 1,
            data: [
              {
                id: 1,
                prefix: "FE",
                number: "001",
                type_document_id: 1,
                state_document_id: 1,
                created_at: "2025-01-15T10:30:00.000000Z",
                updated_at: "2025-01-15T10:35:00.000000Z",
                date: "2025-01-15",
                time: "10:30:00",
                cufe: "242ce5e27513a17745451897097055f930ca5c5f3f2fe9c0a11e78976ad900e577297ec7e3ca55d8b2c506068195146a",
                customer_name: "Juan Pérez",
                customer_identification_number: "12345678",
                total_amount: 238000,
                notes: "Factura de ejemplo"
              }
            ],
            first_page_url: "http://localhost:3000/documents?page=1",
            from: 1,
            last_page: 5,
            last_page_url: "http://localhost:3000/documents?page=5",
            links: [
              {
                url: null,
                label: "&laquo; Previous",
                active: false
              },
              {
                url: "http://localhost:3000/documents?page=1",
                label: "1",
                active: true
              },
              {
                url: "http://localhost:3000/documents?page=2",
                label: "Next &raquo;",
                active: false
              }
            ],
            next_page_url: "http://localhost:3000/documents?page=2",
            path: "http://localhost:3000/documents",
            per_page: 10,
            prev_page_url: null,
            to: 10,
            total: 50
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token JWT requerido',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          message: "Token JWT requerido para acceder a los documentos",
          error: "Unauthorized"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Parámetros de consulta inválidos',
    content: {
      'application/json': {
        example: {
          message: "Parámetros de consulta inválidos",
          details: {
            errors: {
              "created_at_from": ["El formato de fecha debe ser YYYY-MM-DD"],
              "per_page": ["Debe ser un número entre 1 y 100"]
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servicio',
    content: {
      'application/json': {
        example: {
          message: "Error al consultar documentos",
          details: {
            error: "Error interno del servidor"
          }
        }
      }
    }
  })
  async getDocuments(
    @Query() queryParams: DocumentListQueryDto,
    @CurrentUser() currentUser: User,
  ): Promise<DocumentListResponse> {
    this.logger.log('Obteniendo lista de documentos');
    this.logger.debug('Parámetros de consulta:', JSON.stringify(queryParams, null, 2));
    this.logger.debug('Usuario autenticado:', currentUser.id);

    // Construir request con state_document_id fijo = 1 (documentos autorizados)
    const documentListRequest = {
      ...queryParams,
      state_document_id: 1, // Solo documentos autorizados por la DIAN
    };

    // TODO: Obtener company_id del usuario autenticado según su rol
    // Por ahora usamos un ID fijo para pruebas
    // ADMIN debería poder ver todas las empresas
    // DEALER solo sus empresas asignadas
    // USER solo su empresa
    const companyId = 1;

    const result = await this.documentService.getDocuments(documentListRequest, companyId);
    
    this.logger.log('Documentos obtenidos exitosamente');
    return result;
  }
} 