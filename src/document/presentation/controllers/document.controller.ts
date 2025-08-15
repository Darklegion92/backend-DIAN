import { Controller, Get, Post, Query, Body, HttpStatus, Logger, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

import { User } from '@/auth/domain/entities/user.entity';
import { CurrentUser } from '@/auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { DocumentListQueryDto, DownloadPDFDto, SendDocumentElectronicDto, SendEmailDto } from '../dtos/document.dto';
import { DocumentListResponse, SendDocumentElectronicResponse } from '@/document/domain/interfaces/document.interface';
import { DocumentService } from '@/document/infrastructure/services/document.service';
import { Role } from '@/auth/domain/enums/role.enum';
import { EnviarCorreoResponseDto } from '@/payroll/presentation/dtos/enviar-correo.dto';


@ApiTags('Documentos')
@Controller('documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly documentService: DocumentService) {}

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

    if (currentUser.role !== Role.ADMIN) {
      documentListRequest.identification_number = currentUser.company_document;
    }

    const result = await this.documentService.getDocuments(documentListRequest);
    
    this.logger.log('Documentos obtenidos exitosamente');
    return result;
  }

  @Post('send-document-electronic')
  @ApiOperation({
    summary: 'Enviar documento electrónico',
    description: `
    **Envío de Documentos Electrónicos a la DIAN**
    
    Este endpoint permite enviar documentos electrónicos (facturas, notas crédito, notas débito) 
    para su procesamiento y autorización ante la DIAN.
    
    **Estructura del Request:**
    
    1. **header** (string):
       - Cadena de cabecera con formato específico para la DIAN
    
    2. **customer** (string):
       - Cadena con información del cliente en formato específico para la DIAN
    
    3. **detail** (string):
       - Cadena con el detalle de productos/servicios en formato específico para la DIAN
    
    4. **taxes** (string):
       - Cadena con información de impuestos en formato específico para la DIAN
    
    5. **discount** (string):
       - Cadena con información de descuentos en formato específico para la DIAN
    
    6. **payment** (string):
       - Cadena con información de pago en formato específico para la DIAN
    
    7. **advance** (string):
       - Cadena con información de anticipos en formato específico para la DIAN
    
    8. **authorized** (string):
       - Cadena con información de autorización en formato específico para la DIAN
    
    9. **delivery** (string):
       - Cadena con información de entrega en formato específico para la DIAN
    
    10. **paymentCondition** (string):
        - Cadena con condiciones de pago en formato específico para la DIAN
    
    11. **trm** (string):
        - Cadena con información de TRM en formato específico para la DIAN
    
    12. **order** (string):
        - Cadena con información de orden en formato específico para la DIAN
    
    13. **extra** (string):
        - Cadena con información extra en formato específico para la DIAN
    
    14. **Datos técnicos:**
        - resolutionNumber: Número de resolución DIAN
        - tokenDian: Token de autenticación DIAN
        - typeDocumentId: Tipo de documento (1=Invoice, 3=Invoice Contingency, 4=Credit Note, 11=Support Document, 13=Credit Note Document Support)
        - nit: NIT de la empresa
        - number: Número del documento
    
    **Proceso:**
    1. Validación de datos
    2. Procesamiento de cadenas en formato DIAN
    3. Envío a la DIAN
    4. Retorno de respuesta con CUFE y estado
    `,
  })
  @ApiBody({ type: SendDocumentElectronicDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documento enviado exitosamente',
    content: {
      'application/json': {
        example: {
          success: true,
          message: "Documento electrónico procesado correctamente",
                     data: {
             cufe: "242ce5e27513a17745451897097055f930ca5c5f3f2fe9c0a11e78976ad900e577297ec7e3ca55d8b2c506068195146a",
             date: "2025-01-15 10:30:00",
             document: "JVBERi0xLjcKCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDI..."
           }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    content: {
      'application/json': {
        example: {
          success: false,
          message: "Error en los datos del documento",
          errors: {
            header: ["Formato de cadena de cabecera inválido"],
            customer: ["Formato de cadena de cliente inválido"],
            detail: ["Formato de cadena de detalle inválido"],
            tokenDian: ["Token DIAN inválido o expirado"],
            typeDocumentId: ["El tipo de documento debe ser: 1 (Invoice), 3 (Invoice Contingency), 4 (Credit Note), 11 (Support Document), o 13 (Credit Note Document Support)"]
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado',
    content: {
      'application/json': {
        example: {
          success: false,
          message: "No autorizado",
          error: "Token JWT inválido o expirado"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error del servidor',
    content: {
      'application/json': {
        example: {
          success: false,
          message: "Error al procesar el documento",
          error: "Error en el servicio de la DIAN o error interno del servidor"
        }
      }
    }
  })
  async sendDocumentElectronic(
    @Body() sendDocumentElectronicDto: SendDocumentElectronicDto
  ): Promise<SendDocumentElectronicResponse> {
    this.logger.log('Iniciando envío de documento electrónico');
    this.logger.debug('Datos del documento:', {
      number: sendDocumentElectronicDto.number,
      typeDocumentId: sendDocumentElectronicDto.typeDocumentId,
      nit: sendDocumentElectronicDto.nit
    });

    const result = await this.documentService.sendDocumentElectronic(sendDocumentElectronicDto);
    
    this.logger.log('Documento electrónico enviado exitosamente');
    return result;
  }


  @Post('send-email')
  @ApiOperation({
    summary: 'Enviar documento electrónico a un email',
    description: `
    **Envío de Documentos Electrónicos a un email**
    
    Este endpoint permite enviar documentos electrónicos (facturas, notas crédito, notas débito) 
    para su procesamiento y autorización ante la DIAN.`
  })

  @ApiBody({ type: SendEmailDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documento enviado exitosamente',
    content: {
      'application/json': {
        example: {
          success: true,
          message: "Documento electrónico enviado exitosamente",
          data: {
            codigo: 200,
            mensaje: "Correo enviado correctamente.",
            resultado: "Procesado"
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
    content: {
      'application/json': {
        example: {
          success: false,
          message: "Error en los datos del documento",
          errors: {
            number: ["El número del documento es requerido"],
            prefix: ["El prefijo del documento es requerido"],
            correo: ["El correo electrónico es requerido"]
          }
        }
      }
    }
  })
  sendEmail(@Body() sendEmailDto: SendEmailDto, @CurrentUser() currentUser: User): Promise<EnviarCorreoResponseDto> {

    this.logger.log('Iniciando envío de documento electrónico a un email');
    this.logger.debug('Datos del documento:', {
      number: sendEmailDto.number,
      prefix: sendEmailDto.prefix,
      correo: sendEmailDto.correo,
      document_company: sendEmailDto.document_company
    });
    
    return this.documentService.sendEmail(sendEmailDto, currentUser);
 }

  @Get('download-pdf')
  @ApiOperation({
    summary: 'Descargar documento PDF',
    description: 'Este endpoint permite descargar el documento PDF de un documento electrónico.'
  })
  @ApiQuery({
    name: 'number',
    required: true,
    description: 'Número del documento',
    example: '001'
  })
  @ApiQuery({
    name: 'prefix',
    required: true,
    description: 'Prefijo del documento', 
    example: 'FE'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documento PDF descargado exitosamente',
    content: {
      'application/pdf': {
        example: 'JVBERi0xLjcKCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDI...'
      }
    }
  })

  async downloadPDF(
    @Query() queryParams: DownloadPDFDto,
    @Res() res: any
  ): Promise<void> {
    this.logger.log('Iniciando descarga de documento PDF');
    this.logger.debug('Parámetros de consulta:', JSON.stringify(queryParams, null, 2));

    try {
      const pdfBuffer = await this.documentService.downloadPDF(queryParams);
      
      // Configurar headers para descarga de PDF
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="documento_${queryParams.prefix}_${queryParams.number}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      
      // Enviar el buffer directamente
      res.send(pdfBuffer);
    } catch (error) {
      this.logger.error('Error al descargar PDF:', error);
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message || 'Error al descargar el documento PDF'
      });
    }
  }

} 