import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { InvoiceService } from '@/invoice/infrastructure/services/invoice.service';
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { CurrentUser } from '@/auth/presentation/decorators/current-user.decorator';
import { User } from '@/auth/domain/entities/user.entity';
import { CreateInvoiceResponse } from '@/invoice/application/ports/output/dian-service.interface';
import { GenerateTestInvoiceResult } from '@/invoice/domain/interfaces/generate-test-invoice-result.interface';

@ApiTags('Facturas')
@Controller('invoice')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InvoiceController {
  private readonly logger = new Logger(InvoiceController.name);

  constructor(private readonly externalInvoiceService: InvoiceService) {}

  // /api/invoice POST TODOS - Accesible para todos los usuarios autenticados
  @Post()
  @ApiOperation({
    summary: 'Crear factura en DIAN',
    description: `
    **Proceso de Facturación Electrónica DIAN Colombia**
    
    Este endpoint crea una factura electrónica que será procesada por la DIAN (Dirección de Impuestos y Aduanas Nacionales) de Colombia.
    Accesible para todos los usuarios autenticados.
    
    **Flujo del proceso:**
    1. Valida los datos de la factura según normativas DIAN
    2. Genera el XML de la factura electrónica 
    3. Firma digitalmente el documento
    4. Envía la factura a la DIAN para autorización
    5. Retorna la respuesta con CUFE, QR y documentos generados
    
    **Seguridad:**
    - Requiere autenticación JWT Bearer token
    - Utiliza el token de la compañía del usuario autenticado para llamadas al servicio externo
    
    **Documentos generados:**
    - XML firmado de la factura
    - PDF de representación gráfica  
    - XML de documento adjunto
    - Código QR para validación
    `,
  })
  @ApiBody({
    type: CreateInvoiceDto,
    description: 'Datos completos de la factura a crear',
    examples: {
      'factura_basica': {
        summary: 'Factura básica de venta',
        description: 'Ejemplo de factura simple con un producto',
        value: {
          token: "tu_bearer_token_aqui",
          type_document_id: 1,
          number: "FE-001",
          date: "2025-01-15",
          time: "10:30:00",
          customer: {
            identification_number: "12345678",
            dv: 9,
            name: "Juan Pérez",
            first_name: "Juan",
            family_first_surname: "Pérez",
            business_name: "Empresa Ejemplo SAS",
            email: "juan.perez@email.com",
            address: "Calle 123 #45-67",
            phone: "3001234567"
          },
          invoice_lines: [
            {
              unit_measure_id: 70,
              invoiced_quantity: 2,
              line_extension_amount: 200000,
              free_of_charge_indicator: false,
              description: "Producto de ejemplo",
              code: "PROD001",
              type_item_identification_id: 4,
              price_amount: 100000,
              base_quantity: 2,
              tax_totals: [
                {
                  tax_id: 1,
                  tax_amount: 38000,
                  taxable_amount: 200000,
                  percent: 19
                }
              ]
            }
          ],
          legal_monetary_totals: {
            line_extension_amount: 200000,
            tax_exclusive_amount: 200000,
            tax_inclusive_amount: 238000,
            allowance_total_amount: 0,
            charge_total_amount: 0,
            prepaid_amount: 0,
            payable_amount: 238000
          }
        }
      },
      'factura_completa': {
        summary: 'Factura empresarial completa',
        description: 'Ejemplo con múltiples productos y datos completos',
        value: {
          token: "tu_bearer_token_aqui",
          type_document_id: 1,
          number: "FE-002",
          date: "2025-01-15",
          time: "14:45:00",
          customer: {
            identification_number: "900123456",
            dv: 3,
            name: "Cliente Empresarial SAS",
            business_name: "Cliente Empresarial SAS",
            email: "facturacion@cliente.com",
            address: "Carrera 45 #67-89",
            phone: "6012345678"
          },
          invoice_lines: [
            {
              unit_measure_id: 70,
              invoiced_quantity: 1,
              line_extension_amount: 500000,
              free_of_charge_indicator: false,
              description: "Servicio de consultoría",
              code: "SERV001",
              type_item_identification_id: 4,
              price_amount: 500000,
              base_quantity: 1,
              tax_totals: [
                {
                  tax_id: 1,
                  tax_amount: 95000,
                  taxable_amount: 500000,
                  percent: 19
                }
              ]
            },
            {
              unit_measure_id: 70,
              invoiced_quantity: 3,
              line_extension_amount: 300000,
              free_of_charge_indicator: false,
              description: "Producto adicional",
              code: "PROD002",
              type_item_identification_id: 4,
              price_amount: 100000,
              base_quantity: 3,
              tax_totals: [
                {
                  tax_id: 1,
                  tax_amount: 57000,
                  taxable_amount: 300000,
                  percent: 19
                }
              ]
            }
          ],
          legal_monetary_totals: {
            line_extension_amount: 800000,
            tax_exclusive_amount: 800000,
            tax_inclusive_amount: 952000,
            allowance_total_amount: 0,
            charge_total_amount: 0,
            prepaid_amount: 0,
            payable_amount: 952000
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Factura creada exitosamente en la DIAN',
    content: {
      'application/json': {
        example: {
          success: true,
          message: "Factura creada exitosamente",
          data: {
            success: true,
            message: "AttachedDocument #SETP990000001 generada con éxito",
            send_email_success: false,
            send_email_date_time: false,
            urlinvoicexml: "FES-SETP990000001.xml",
            urlinvoicepdf: "FES-SETP990000001.pdf",
            urlinvoiceattached: "ad09013573290002500000002.xml",
            cufe: "242ce5e27513a17745451897097055f930ca5c5f3f2fe9c0a11e78976ad900e577297ec7e3ca55d8b2c506068195146a",
            QRStr: "https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=242ce5e27513a17745451897097055f930ca5c5f3f2fe9c0a11e78976ad900e577297ec7e3ca55d8b2c506068195146a",
            certificate_days_left: 362,
            resolution_days_left: 1692,
            ResponseDian: {
              Envelope: {
                Header: {
                  Action: {
                    _attributes: {
                      mustUnderstand: "1"
                    },
                    _value: "http://wcf.dian.colombia/IWcfDianCustomerServices/SendBillSyncResponse"
                  },
                  Security: {
                    _attributes: {
                      mustUnderstand: "1"
                    },
                    Timestamp: {
                      _attributes: {
                        Id: "_0"
                      },
                      Created: "2025-06-02T16:08:04.018Z",
                      Expires: "2025-06-02T16:13:04.018Z"
                    }
                  }
                },
                Body: {
                  SendBillSyncResponse: {
                    SendBillSyncResult: {
                      ErrorMessage: {
                        string: "Regla: FAJ43b, Notificación: Nombre informado No corresponde al registrado en el RUT con respecto al Nit suminstrado."
                      },
                      IsValid: "true",
                      StatusCode: "00",
                      StatusDescription: "Procesado Correctamente.",
                      StatusMessage: "La Factura electrónica SETP990000001, ha sido autorizada.",
                      XmlBase64Bytes: "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiIHN0YW5kYWxvbmU9Im5vIj8+..."
                    }
                  }
                }
              }
            }
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
          message: "Token JWT requerido para crear facturas",
          error: "Unauthorized"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de factura inválidos',
    content: {
      'application/json': {
        example: {
          message: "Datos de factura inválidos",
          details: {
            errors: {
              "customer.identification_number": ["El campo número de identificación es requerido"],
              "invoice_lines.0.description": ["La descripción del producto es requerida"]
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.REQUEST_TIMEOUT,
    description: 'Timeout en el servicio externo',
    content: {
      'application/json': {
        example: {
          message: "Timeout en el servicio externo",
          details: "El servicio externo tardó demasiado en responder"
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
          message: "Error interno del servicio externo",
          details: {
            error: "Error procesando la factura en la DIAN"
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'Servicio externo no disponible',
    content: {
      'application/json': {
        example: {
          message: "Servicio externo no disponible",
          details: "El servicio externo está temporalmente fuera de servicio"
        }
      }
    }
  })
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto & { token:string },
    @CurrentUser() currentUser: User,
  ): Promise<CreateInvoiceResponse> {
    this.logger.log('Iniciando creación de factura');
    this.logger.debug('Datos recibidos:', JSON.stringify(createInvoiceDto, null, 2));
    this.logger.debug('Usuario autenticado:', currentUser.id);

    const { token, ...invoiceData } = createInvoiceDto;
    
    this.logger.log('Enviando datos al servicio externo');
    const result = await this.externalInvoiceService.createInvoice(invoiceData, token);
    
    this.logger.log('Factura creada exitosamente');
    return result;
  }

  @Post('generate-test-invoice')
  @ApiOperation({
    summary: 'Generar 5 facturas y 5 notas crédito de prueba',
    description: `
    Envía a apidian 5 facturas y 5 notas crédito de prueba (10 documentos en total).
    Cada nota crédito referencia a su factura correspondiente.
    Retorna si los 10 documentos fueron aceptados correctamente por la DIAN.
    Requiere el NIT de la empresa en el body (empresa con token DIAN configurado).
    `,
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['nit'],
      properties: {
        nit: { type: 'string', description: 'NIT de la empresa (para obtener tokenDian)' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Proceso finalizado. allAccepted indica si los 10 documentos fueron aceptados.',
    content: {
      'application/json': {
        example: {
          allAccepted: true,
          totalDocuments: 10,
          acceptedCount: 10,
          invoices: [
            { index: 1, number: 'SETP990001147', accepted: true, cufe: '...' },
            { index: 2, number: 'SETP990001148', accepted: true, cufe: '...' },
          ],
          creditNotes: [
            { index: 1, number: 'NC74', accepted: true },
            { index: 2, number: 'NC75', accepted: true },
          ],
          message: 'Los 10 documentos (5 facturas y 5 notas crédito) fueron aceptados correctamente.',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Empresa no encontrada o sin token DIAN',
  })
  async generateTestInvoice(
    @Body('testId') testId: string,
    @CurrentUser() currentUser: User,
  ): Promise<GenerateTestInvoiceResult> {
    if (!testId?.trim()) {
      throw new HttpException(
        { message: 'El testId es requerido' },
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.externalInvoiceService.generateTestInvoice(testId.trim(), currentUser.company_document);
  }
} 