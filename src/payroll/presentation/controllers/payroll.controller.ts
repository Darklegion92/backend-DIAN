import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  Logger, 
  UseGuards 
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { CreatePayrollResponseDto } from '../dtos/payroll-response.dto';
import { PayrollRequestDto } from '../dtos/payroll-request.dto';
import { ProcessPayrollService } from '@/payroll/application/services/process-payroll.service';

/**
 * Controlador de Nóminas Electrónicas
 * Maneja todos los endpoints relacionados con el procesamiento de nóminas para la DIAN
 * Implementa los principios SOLID y arquitectura hexagonal
 */
@ApiTags('🏢 Nóminas Electrónicas')
@Controller('payroll')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PayrollController {
  private readonly logger = new Logger(PayrollController.name);

  constructor(
    private readonly payrollService: ProcessPayrollService
  ) {}

  /**
   * Endpoint principal para procesar nóminas regulares
   * Envía la nómina a la DIAN para su validación y obtención del CUNE
   */
  @Post()
  @ApiOperation({
    summary: 'Procesar Nómina Electrónica',
    description: `
    **Procesamiento de Nómina Electrónica DIAN Colombia**
    
    Este endpoint procesa una nómina electrónica que será validada por la DIAN (Dirección de Impuestos y Aduanas Nacionales).
    
    **Flujo del proceso:**
    1. Valida los datos de la nómina según normativas DIAN
    2. Genera el XML de la nómina electrónica 
    3. Firma digitalmente el documento
    4. Envía la nómina a la DIAN para validación
    5. Retorna la respuesta con CUNE, QR y documentos generados
    
    **Casos de uso:**
    - Nóminas mensuales regulares
    - Nóminas quincenales
    - Liquidaciones de nómina
    - Pagos adicionales
    
    **Validaciones automáticas:**
    - Datos del trabajador válidos
    - Cálculos matemáticos correctos
    - Cumplimiento de normativas laborales
    - Formato de campos según estándares DIAN
    `,
  })
  @ApiBody({
    type: PayrollRequestDto,
    description: 'Datos completos de la nómina a procesar',
    examples: {
      'nomina_mensual': {
        summary: 'Nómina mensual completa',
        description: 'Ejemplo de nómina mensual con todos los conceptos',
        value: {
          noelAno: 2024,
          noelMes: 1,
          noelNit: "900123456",
          noelItem: 1,
          noelNombre: "Juan Pérez Gómez",
          noelPrefijo: "NE",
          noelNumero: "001",
          noelFecha: "2024-01-31",
          noelPeriodo: "202401",
          noelEmail: "juan.perez@email.com",
          noelTipoid: "CC",
          noelFecing: "2023-01-01",
          noelTipocont: 1,
          noelSubtipoc: 1,
          noelSueldo: "1300000",
          noelDiastr: 30,
          noelAuxtr: "140000",
          noelDevengado: "1440000",
          noelDedsal: "52000",
          noelDedpens: "52000",
          noelDeducido: "104000",
          noelNeto: "1336000",
          noelEstado: "PENDIENTE"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Nómina procesada exitosamente',
    content: {
      'application/json': {
        example: {
          success: true,
          message: "Nómina procesada exitosamente",
          data: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            fullNumber: "NE001",
            cune: "CUNE123456789012345678901234567890123456789012345678901234567890",
            status: "PROCESSED",
            processedAt: "2024-01-20T10:30:00.000Z",
            pdfUrl: "https://api.dian.gov.co/documents/payroll/123/pdf",
            xmlUrl: "https://api.dian.gov.co/documents/payroll/123/xml",
            qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
            transactionId: "TXN789012345"
          },
          processingTime: 1500
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de nómina inválidos',
    content: {
      'application/json': {
        example: {
          success: false,
          message: "Error en validación de datos",
          errors: [
            "La identificación del trabajador es requerida",
            "El salario base debe ser mayor a 0",
            "Las fechas del período son inconsistentes"
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token inválido'
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor'
  })
  async processPayroll(
    @Body() payrollRequestDto: PayrollRequestDto,
  ): Promise<CreatePayrollResponseDto> {
    try {

      const repsonse =  await this.payrollService.processPayroll(payrollRequestDto);  

      return repsonse;
    } catch (error) {
      this.logger.error(`❌ Error procesando nómina: ${error.message}`, error.stack);
      throw error;
    }
  }
} 