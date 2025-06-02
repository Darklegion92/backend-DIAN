import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateInvoiceUseCase } from '../../application/use-cases/create-invoice.use-case';
import { GetInvoiceStatusUseCase } from '../../application/use-cases/get-invoice-status.use-case';
import { CreateInvoiceDto } from '../../application/dtos/create-invoice.dto';

@ApiTags('📄 Facturación Electrónica')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly getInvoiceStatusUseCase: GetInvoiceStatusUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear nueva factura electrónica',
    description: 'Crea una nueva factura electrónica en el sistema DIAN y la envía para procesamiento.',
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Factura creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Factura creada exitosamente' },
        data: {
          type: 'object',
          properties: {
            number: { type: 'string', example: 'FACT-001' },
            status: { type: 'string', example: 'SENT' },
            date: { type: 'string', example: '2024-01-15' },
            time: { type: 'string', example: '10:30:00' },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Error de validación' },
        error: { type: 'string', example: 'El número de factura es requerido' },
      },
    },
  })
  @ApiResponse({ 
    status: 503, 
    description: 'Servicio externo no disponible',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'No se pudo conectar con el servicio externo' },
        error: { type: 'string', example: 'Timeout o conexión rechazada' },
      },
    },
  })
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto) {
    try {
      const invoice = await this.createInvoiceUseCase.execute(createInvoiceDto);
      
      return {
        success: true,
        message: 'Factura creada exitosamente',
        data: {
          number: invoice.number,
          status: invoice.status,
          date: invoice.date,
          time: invoice.time,
          typeDocumentId: invoice.typeDocumentId,
          resolutionNumber: invoice.resolutionNumber,
          prefix: invoice.prefix,
          notes: invoice.notes,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get(':invoiceNumber/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Consultar estado de factura',
    description: 'Obtiene el estado actual de una factura electrónica por su número.',
  })
  @ApiParam({
    name: 'invoiceNumber',
    description: 'Número único de la factura',
    example: 'FACT-001',
    type: 'string',
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de la factura obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Estado consultado exitosamente' },
        data: {
          type: 'object',
          properties: {
            invoiceNumber: { type: 'string', example: 'FACT-001' },
            status: { 
              type: 'string', 
              enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
              example: 'ACCEPTED' 
            },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Factura no encontrada',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Factura no encontrada' },
        error: { type: 'string', example: 'El número de factura no existe' },
      },
    },
  })
  async getInvoiceStatus(@Param('invoiceNumber') invoiceNumber: string) {
    try {
      const result = await this.getInvoiceStatusUseCase.execute(invoiceNumber);
      
      return {
        success: true,
        message: 'Estado consultado exitosamente',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
} 