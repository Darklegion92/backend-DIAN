import { 
  Controller, 
  Post, 
  Body, 
  HttpStatus, 
  Logger, 
  UseGuards, 
  Req
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
import { EnviarPayrollRequestDto, EnviarPayrollResponseDto } from '../dtos/enviar-payroll.dto';
import { ConsultarFoliosRequestDto, ConsultarFoliosResponseDto } from '../dtos/consultar-folios.dto';
import { EnviarCorreoRequestDto, EnviarCorreoResponseDto } from '../dtos/enviar-correo.dto';
import { 
  DescargarDocumentoRequestDto, 
  DescargarXMLResponseDto, 
  DescargarPDFResponseDto 
} from '../dtos/descargar-documento.dto';

/**
 * Controlador de Nóminas Electrónicas
 * Maneja todos los endpoints relacionados con el procesamiento de nóminas para la DIAN
 * Implementa los principios SOLID y arquitectura hexagonal
 */
@ApiTags('🏢 Nóminas Electrónicas')
@Controller('payroll')
export class PayrollController {
  private readonly logger = new Logger(PayrollController.name);

  constructor(
    private readonly payrollService: ProcessPayrollService
  ) {}

  /**
   * Endpoint principal para procesar nóminas regulares
   * Envía la nómina a la DIAN para su validación y obtención del CUNE
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @Post('ConsultarFolios')
  @ApiOperation({
    summary: 'Consultar Folios Disponibles',
    description: `
    **Método ConsultarFolios - Servicio de Emisión de Nómina Electrónica DIAN**
    
    Permite consultar la cantidad de folios para procesar el Soporte de Pago de Nómina Electrónica 
    y Nómina de Ajuste.
    
    **Parámetros requeridos:**
    - tokenEmpresa: Token suministrado por The Factory HKA Colombia
    - tokenPassword: Contraseña del token
    
    **Respuesta incluye:**
    - Código de estado de la operación
    - Mensaje descriptivo
    - Cantidad de folios restantes disponibles
    `,
  })
  @ApiBody({
    type: ConsultarFoliosRequestDto,
    description: 'Datos para consultar folios disponibles',
    examples: {
      'consulta_folios': {
        summary: 'Consulta de folios',
        description: 'Ejemplo de consulta de folios disponibles',
        value: {
          tokenEmpresa: "token_empresa_demo",
          tokenPassword: "password_token"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Consulta realizada exitosamente',
    type: ConsultarFoliosResponseDto,
    content: {
      'application/json': {
        example: {
          codigo: 200,
          mensaje: "Consulta realizada exitosamente",
          resultado: "Procesado",
          foliosRestantes: 1000
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de consulta inválidos'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token inválido'
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor'
  })
  async consultarFolios(
    @Body() consultarFoliosRequestDto: ConsultarFoliosRequestDto,
  ): Promise<ConsultarFoliosResponseDto> {
    try {
      this.logger.log(`📊 Consultando folios disponibles`);
      
      // TODO: Implementar lógica de consulta de folios
      // Por ahora retornamos una respuesta simulada
      const response: ConsultarFoliosResponseDto = {
        codigo: 200,
        mensaje: "Consulta realizada exitosamente",
        resultado: "Procesado",
        foliosRestantes: 1000
      };

      this.logger.log(`✅ Folios consultados exitosamente. Disponibles: ${response.foliosRestantes}`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error consultando folios: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Endpoint para enviar correo electrónico según especificación DIAN
   * Implementa el método "EnviarCorreo" del servicio de nómina electrónica
   */
  @Post('EnviarCorreo')
  @ApiOperation({
    summary: 'Enviar Correo Electrónico',
    description: `
    **Método EnviarCorreo - Servicio de Emisión de Nómina Electrónica DIAN**
    
    Permite reenviar a una dirección de correo electrónico el Soporte de Pago de Nómina Electrónica 
    y Nómina de Ajuste.
    
    **Parámetros requeridos:**
    - tokenEmpresa: Token suministrado por The Factory HKA Colombia
    - tokenPassword: Contraseña del token
    - email: Dirección de correo electrónico del empleado
    - consecutivoDocumentoNom: Prefijo y Consecutivo del Documento electrónico
    
    **Casos de uso:**
    - Reenvío de nómina a empleado
    - Notificación de nómina procesada
    - Envío de nómina de ajuste
    `,
  })
  @ApiBody({
    type: EnviarCorreoRequestDto,
    description: 'Datos para envío de correo electrónico',
    examples: {
      'envio_correo': {
        summary: 'Envío de correo',
        description: 'Ejemplo de envío de correo con nómina',
        value: {
          tokenEmpresa: "token_empresa_demo",
          tokenPassword: "password_token",
          email: "juan.perez@email.com",
          consecutivoDocumentoNom: "PRUE980338212"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Correo enviado exitosamente',
    type: EnviarCorreoResponseDto,
    content: {
      'application/json': {
        example: {
          codigo: 200,
          mensaje: "Correo enviado exitosamente",
          resultado: "Procesado"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de correo inválidos'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token inválido'
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor'
  })
  async enviarCorreo(
    @Body() enviarCorreoRequestDto: EnviarCorreoRequestDto,
  ): Promise<EnviarCorreoResponseDto> {
    try {
      this.logger.log(`📧 Enviando correo a: ${enviarCorreoRequestDto.email}`);
      
      // TODO: Implementar lógica de envío de correo
      // Por ahora retornamos una respuesta simulada
      const response: EnviarCorreoResponseDto = {
        codigo: 200,
        mensaje: "Correo enviado exitosamente",
        resultado: "Procesado"
      };

      this.logger.log(`✅ Correo enviado exitosamente a: ${enviarCorreoRequestDto.email}`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error enviando correo: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Endpoint para descargar documento XML según especificación DIAN
   * Implementa el método "DescargarXML" del servicio de nómina electrónica
   */
  @Post('DescargarXML')
  @ApiOperation({
    summary: 'Descargar Documento XML',
    description: `
    **Método DescargarXML - Servicio de Emisión de Nómina Electrónica DIAN**
    
    Permite descargar documento Soporte de Pago de Nómina Electrónica, Nota de Ajuste de Documento 
    Soporte de Pago de Nómina Electrónica en formato XML.
    
    **Parámetros requeridos:**
    - tokenEmpresa: Token suministrado por The Factory HKA Colombia
    - tokenPassword: Contraseña del token
    - consecutivoDocumentoNom: Prefijo y Consecutivo del Documento electrónico
    
    **Respuesta incluye:**
    - CUNE del documento
    - Documento XML codificado en Base64
    - Hash de verificación
    - Información del documento
    `,
  })
  @ApiBody({
    type: DescargarDocumentoRequestDto,
    description: 'Datos para descarga de documento XML',
    examples: {
      'descarga_xml': {
        summary: 'Descarga de XML',
        description: 'Ejemplo de descarga de documento XML',
        value: {
          tokenEmpresa: "token_empresa_demo",
          tokenPassword: "password_token",
          consecutivoDocumentoNom: "PRUE980338212"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documento XML descargado exitosamente',
    type: DescargarXMLResponseDto,
    content: {
      'application/json': {
        example: {
          codigo: 200,
          cune: "CUNE123456789012345678901234567890123456789012345678901234567890",
          documento: "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4K...",
          hash: "a1b2c3d4e5f6",
          mensaje: "Documento descargado exitosamente",
          nombre: "PRUE980338212",
          resultado: "Procesado"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de descarga inválidos'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token inválido'
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor'
  })
  async descargarXML(
    @Body() descargarDocumentoRequestDto: DescargarDocumentoRequestDto,
  ): Promise<DescargarXMLResponseDto> {
    try {
      this.logger.log(`📄 Descargando XML: ${descargarDocumentoRequestDto.consecutivoDocumentoNom}`);
      
      // TODO: Implementar lógica de descarga de XML
      // Por ahora retornamos una respuesta simulada
      const response: DescargarXMLResponseDto = {
        codigo: 200,
        cune: "CUNE123456789012345678901234567890123456789012345678901234567890",
        documento: "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4K...",
        hash: "a1b2c3d4e5f6",
        mensaje: "Documento descargado exitosamente",
        nombre: descargarDocumentoRequestDto.consecutivoDocumentoNom,
        resultado: "Procesado"
      };

      this.logger.log(`✅ XML descargado exitosamente: ${response.nombre}`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error descargando XML: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Endpoint para descargar documento PDF según especificación DIAN
   * Implementa el método "DescargarPDF" del servicio de nómina electrónica
   */
  @Post('DescargarPDF')
  @ApiOperation({
    summary: 'Descargar Documento PDF',
    description: `
    **Método DescargarPDF - Servicio de Emisión de Nómina Electrónica DIAN**
    
    Permite descargar la representación gráfica de un documento Soporte de Pago de Nómina Electrónica 
    y Nómina de Ajuste.
    
    **Parámetros requeridos:**
    - tokenEmpresa: Token suministrado por The Factory HKA Colombia
    - tokenPassword: Contraseña del token
    - consecutivoDocumentoNom: Prefijo y Consecutivo del Documento electrónico
    
    **Respuesta incluye:**
    - CUNE del documento
    - Documento PDF codificado en Base64
    - Hash de verificación
    - Información del documento
    `,
  })
  @ApiBody({
    type: DescargarDocumentoRequestDto,
    description: 'Datos para descarga de documento PDF',
    examples: {
      'descarga_pdf': {
        summary: 'Descarga de PDF',
        description: 'Ejemplo de descarga de documento PDF',
        value: {
          tokenEmpresa: "token_empresa_demo",
          tokenPassword: "password_token",
          consecutivoDocumentoNom: "PRUE980338212"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Documento PDF descargado exitosamente',
    type: DescargarPDFResponseDto,
    content: {
      'application/json': {
        example: {
          codigo: 200,
          cune: "CUNE123456789012345678901234567890123456789012345678901234567890",
          documento: "JVBERi0xLjQKJcOkw7zDtsO...",
          hash: "a1b2c3d4e5f6",
          mensaje: "Documento descargado exitosamente",
          nombre: "PRUE980338212",
          resultado: "Procesado"
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de descarga inválidos'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token inválido'
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor'
  })
  async descargarPDF(
    @Body() descargarDocumentoRequestDto: DescargarDocumentoRequestDto,
  ): Promise<DescargarPDFResponseDto> {
    try {
      this.logger.log(`📄 Descargando PDF: ${descargarDocumentoRequestDto.consecutivoDocumentoNom}`);
      
      // TODO: Implementar lógica de descarga de PDF
      // Por ahora retornamos una respuesta simulada
      const response: DescargarPDFResponseDto = {
        codigo: 200,
        cune: "CUNE123456789012345678901234567890123456789012345678901234567890",
        documento: "JVBERi0xLjQKJcOkw7zDtsO...",
        hash: "a1b2c3d4e5f6",
        mensaje: "Documento descargado exitosamente",
        nombre: descargarDocumentoRequestDto.consecutivoDocumentoNom,
        resultado: "Procesado"
      };

      this.logger.log(`✅ PDF descargado exitosamente: ${response.nombre}`);
      return response;
    } catch (error) {
      this.logger.error(`❌ Error descargando PDF: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Endpoint para enviar nómina electrónica según especificación DIAN
   * Implementa el método "Enviar" del servicio de nómina electrónica
   */
  @Post('Enviar')
  @ApiOperation({
    summary: 'Enviar Nómina Electrónica DIAN',
    description: `
    **Método Enviar - Servicio de Emisión de Nómina Electrónica DIAN**
    
    Este endpoint implementa el método "Enviar" según la especificación oficial de The Factory HKA Colombia
    para el procesamiento de nóminas electrónicas ante la DIAN.
    
    **Parámetros requeridos:**
    - idSoftware: NIT del empleador emisor
    - tokenEmpresa: Token suministrado por el proveedor tecnológico
    - tokenPassword: Contraseña del token
    - nitEmpleador: NIT del empleador que realiza el documento electrónico
    - nomina: Objeto completo de nómina electrónica
    
    **Estructura de la nómina:**
    - Deducciones: Salud, pensión, libranzas, etc.
    - Devengados: Salario básico, auxilios, comisiones, etc.
    - Trabajador: Información completa del empleado
    - Pagos: Fechas y formas de pago
    - Periodos: Periodo laboral del trabajador
    
    **Validaciones automáticas:**
    - Formato de campos según estándares DIAN
    - Cálculos matemáticos correctos
    - Cumplimiento de normativas laborales
    - Validación de códigos geográficos y catalogos
    `,
  })
  @ApiBody({
    type: EnviarPayrollRequestDto,
    description: 'Datos completos para envío de nómina electrónica DIAN',
    examples: {
      'nomina_completa': {
        summary: 'Nómina electrónica completa',
        description: 'Ejemplo de nómina con todos los conceptos según especificación DIAN',
        value: {
          idSoftware: "900123456",
          tokenEmpresa: "token_empresa_demo",
          tokenPassword: "password_token",
          nitEmpleador: "900123456",
          nomina: {
            consecutivoDocumentoNom: "NE001",
            deducciones: {
              salud: { valor: "52000" },
              fondoPension: { valor: "52000" },
              fondoSP: { valor: "10000" }
            },
            devengados: {
              basico: { valor: "1300000" },
              auxilio: { valor: "140000" },
              transporte: { valor: "140000" }
            },
            fechaEmisionNom: "2024-01-31 10:30:00",
            novedad: "0",
            lugarGeneracionXML: {
              codigoPais: "CO",
              codigoDepartamento: "11",
              codigoMunicipio: "11001",
              codigoIdioma: "es"
            },
            pagos: [{
              fechasPagos: [{
                fecha: "2024-01-31",
                formaPago: "1",
                medioPago: "1"
              }]
            }],
            periodoNomina: "1",
            periodos: [{
              fechaIngreso: "2023-01-01",
              fechaLiquidacionInicio: "2024-01-01",
              fechaLiquidacionFin: "2024-01-31",
              fechaRetiro: null,
              tiempoLaborado: "365.00"
            }],
            rangoNumeracionNom: "NE-001",
            trabajador: {
              tipoIdentificacion: "CC",
              numeroDocumento: "12345678",
              primerApellido: "Pérez",
              segundoApellido: "Gómez",
              primerNombre: "Juan",
              otrosNombres: "Carlos",
              codigoTrabajador: "01",
              tipoTrabajador: "01",
              subTipoTrabajador: "00",
              tipoContrato: "1",
              salarioIntegral: "0",
              altoRiesgoPension: "0",
              sueldo: "1300000",
              email: "juan.perez@email.com",
              lugarTrabajoDepartamentoEstado: "11",
              lugarTrabajoDireccion: "Calle 123 # 45-67",
              lugarTrabajoMunicipioCiudad: "11001",
              lugarTrabajoPais: "CO"
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Nómina enviada exitosamente',
    type: EnviarPayrollResponseDto,
    content: {
      'application/json': {
        example: {
          codigo: 200,
          mensaje: "Documento procesado exitosamente",
          cune: "CUNE123456789012345678901234567890123456789012345678901234567890",
          descripcion: null,
          reglasValidacionDIAN: null,
          resultado: "Procesado",
          trackID: "TXN789012345",
          tipoDocumento: "1"
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
          codigo: 400,
          mensaje: "Error en validación de datos",
          cune: null,
          descripcion: "Los datos del trabajador son requeridos",
          reglasValidacionDIAN: "Validación DIAN: Campo obligatorio faltante",
          resultado: "Error",
          trackID: null,
          tipoDocumento: null
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
  async enviarPayroll(
    @Body() enviarPayrollRequestDto: EnviarPayrollRequestDto,
  ): Promise<EnviarPayrollResponseDto> {

    return await this.payrollService.enviarPayroll(enviarPayrollRequestDto);  
  }
} 