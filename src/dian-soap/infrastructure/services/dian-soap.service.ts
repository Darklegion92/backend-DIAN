import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as soap from 'soap';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import { SendBillDto } from '../../domain/dtos/send-bill.dto';
import { GetStatusDto } from '../../domain/dtos/get-status.dto';
import { soapLogger } from './logger.service';
import { EnviarRequestDto } from '../../presentation/dtos/enviar-request.dto';
import { EnviarResponseDto, MensajeValidacion } from '../../presentation/dtos/response/enviar-response.dto';
import { createHash } from 'crypto';
import { DocumentTransformerFactory } from './transformers/document-transformer.factory';
import { ProcessInvoiceUseCase } from '@/invoice/application/use-cases/process-invoice.use-case';
import { CompanyService } from '@/company/application/services/company.service';
import { DocumentService } from '@/document/infrastructure/services/document.service';

@Injectable()
export class DianSoapService implements OnModuleInit {
  private wsdlPath: string;
  private server: express.Express;
  private readonly logger = new Logger(DianSoapService.name);

  constructor(
    private readonly documentTransformerFactory: DocumentTransformerFactory,
    private readonly processInvoiceUseCase: ProcessInvoiceUseCase,
    private readonly companyService: CompanyService,
    private readonly documentService: DocumentService
  ) {
    // Busca el archivo WSDL en el directorio src o dist
    const srcPath = path.join(__dirname, '..', 'wsdl', 'dian.wsdl');
    const distPath = path.join(__dirname, '..', '..', '..', 'src', 'dian-soap', 'infrastructure', 'wsdl', 'dian.wsdl');

    this.wsdlPath = fs.existsSync(srcPath) ? srcPath : distPath;

    if (!fs.existsSync(this.wsdlPath)) {
      throw new Error(`WSDL file not found at ${this.wsdlPath}`);
    }

    this.server = express();
    this.server.use(express.text({ type: 'text/xml' }));
    this.server.use((req, res, next) => {
      soapLogger.info('Petición entrante', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.method === 'POST' ? req.body : undefined
      });
      next();
    });

    this.server.use((err, req, res, next) => {
      soapLogger.error('Error del servidor', {
        error: err.message,
        stack: err.stack
      });
      next(err);
    });
  }

  async onModuleInit() {
    try {
      const serviceObject = {
        Service: {
          ServiceSoap: {
            Enviar: async (args: any) => {
              const requestId = Date.now().toString();
              soapLogger.info('Recibida solicitud Enviar', {
                requestId,
                args: JSON.stringify(args)
              });

              try {
                const { tokenEmpresa, tokenPassword, factura } = args;

                if (!tokenEmpresa || !tokenPassword || !factura) {
                  throw new Error('Faltan datos requeridos: tokenEmpresa, tokenPassword o factura');
                }

                const company = await this.companyService.getCompanyByTokenEmpresa(tokenEmpresa);

                if (!company || company.tokenPassword !== tokenPassword) {
                  return new EnviarResponseDto({
                    codigo: 401,
                    consecutivoDocumento: factura.consecutivoDocumento || `PRUE${Date.now()}`,
                    esValidoDian: false,
                    mensaje: 'Token o contraseña incorrectos',
                    mensajesValidacion: [],
                  });
                }

                const documentoTransformado = await this.documentTransformerFactory.transform(factura, company.id);

                soapLogger.info('Documento transformado', {
                  requestId,
                  tipoDocumento: factura.tipoDocumento,
                  documentoTransformado
                });

                if (documentoTransformado.prefix === "SETP") {
                  documentoTransformado.number = 990080000 + documentoTransformado.number;
                }

                const responseInvoice = await this.processInvoiceUseCase.sendInvoiceToDian(documentoTransformado, company.tokenDian);

                if (responseInvoice.ResponseDian) {
                  const body = responseInvoice.ResponseDian.Envelope.Body;
                  if (body.SendBillSyncResponse.SendBillSyncResult.IsValid === "true") {
                    const cufe = responseInvoice.cufe;
                    const response = new EnviarResponseDto({
                      codigo: 200,
                      consecutivoDocumento: factura.consecutivoDocumento || `PRUE${Date.now()}`,
                      cufe,
                      esValidoDian: true,
                      fechaAceptacionDIAN: new Date().toISOString().slice(0, 19).replace('T', ' '),
                      hash: createHash('sha384').update(responseInvoice.attacheddocument).digest('hex'),
                      mensaje: 'Documento procesado correctamente',
                      mensajesValidacion: [],
                      nombre: 'DOCUMENTO_PROCESADO',
                      qr: responseInvoice.QRStr,
                      reglasNotificacionDIAN: [],
                      reglasValidacionDIAN: [],
                      resultado: 'Procesado',
                      tipoCufe: 'CUFE-SHA384',
                      xml: Buffer.from(responseInvoice.attacheddocument).toString('base64')
                    });
                    return { EnviarResult: response };
                  }


                  if (body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.string?.includes("Regla: 90")) {
                    const response = new EnviarResponseDto({
                      codigo: 400,
                      consecutivoDocumento: factura.consecutivoDocumento || `PRUE${Date.now()}`,
                      esValidoDian: true,
                      fechaAceptacionDIAN: new Date().toISOString().slice(0, 19).replace('T', ' '),
                      hash: createHash('sha384').update(responseInvoice.attacheddocument).digest('hex'),
                      mensaje: 'Documento ha sido enviado con otro proveedor electrónico',
                      mensajesValidacion: [],
                      nombre: 'DOCUMENTO_PROCESADO',
                      qr: responseInvoice.QRStr,
                      reglasNotificacionDIAN: [],
                      reglasValidacionDIAN: [],
                      resultado: 'Error',
                      tipoCufe: 'CUFE-SHA384',
                      xml: Buffer.from(responseInvoice.attacheddocument).toString('base64')
                    });
                    return { EnviarResult: response };

                  }

                  const mensajesValidacion: MensajeValidacion[] =  [];

                  if(body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.string){
                    mensajesValidacion.push({
                      codigo: "401",
                      mensaje: body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.string
                    })
                  }else if(body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.strings){

                    body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.strings.forEach(mensaje => {
                      mensajesValidacion.push({
                        codigo: "401",
                        mensaje: mensaje
                      })
                    })
                  }

                  const response = new EnviarResponseDto({
                    codigo: 401,
                    consecutivoDocumento: factura.consecutivoDocumento || `PRUE${Date.now()}`,
                    esValidoDian: false,
                    fechaAceptacionDIAN: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    hash: createHash('sha384').update(responseInvoice.attacheddocument).digest('hex'),
                    mensaje: 'Documento no valido',
                    mensajesValidacion,
                    nombre: 'DOCUMENTO_PROCESADO_ERROR',
                    reglasNotificacionDIAN: [],
                    reglasValidacionDIAN: [],
                    resultado: 'Error',
                  });
                  return { EnviarResult: response };

                } else {
                  if (responseInvoice.message.includes("Este documento ya fue enviado anteriormente, se registra en la base de datos.")) {
                    const responseDocument = await this.documentService.getDocument(documentoTransformado.prefix, documentoTransformado.number, company.identificationNumber);
                    if (responseDocument) {

                      const qrString = ""
                      const attachedDocument = responseDocument.xml;
                      const response = new EnviarResponseDto({
                        codigo: 200,
                        consecutivoDocumento: factura.consecutivoDocumento || `PRUE${Date.now()}`,
                        cufe: responseDocument.cufe,
                        esValidoDian: true,
                        fechaAceptacionDIAN: responseDocument.dateIssue.toISOString().slice(0, 19).replace('T', ' '),
                        hash: createHash('sha384').update(attachedDocument).digest('hex'),
                        mensaje: 'Documento procesado correctamente',
                        mensajesValidacion: [],
                        nombre: 'DOCUMENTO_PROCESADO',
                        qr: qrString,
                        reglasNotificacionDIAN: [],
                        reglasValidacionDIAN: [],
                        resultado: 'Procesado',
                        tipoCufe: 'CUFE-SHA384',
                        xml: Buffer.from(attachedDocument).toString('base64')
                      });
                      return { EnviarResult: response };
                    }
                  }
                }
              } catch (error) {
                soapLogger.error('Error procesando solicitud Enviar', {
                  requestId,
                  error: error.message,
                  stack: error.stack
                });

                return {
                  EnviarResult: new EnviarResponseDto({
                    codigo: 500,
                    consecutivoDocumento: '',
                    cufe: '',
                    esValidoDian: false,
                    mensaje: error.message,
                    mensajesValidacion: [{
                      codigo: '500',
                      mensaje: error.message
                    }],
                    nombre: 'ERROR_PROCESAMIENTO',
                    qr: '',
                    reglasNotificacionDIAN: [],
                    reglasValidacionDIAN: [],
                    resultado: 'Error',
                    tipoCufe: 'CUFE-SHA384',
                  })
                };
              }
            },

            EstadoDocumento: async (args: any) => {
              const requestId = Date.now().toString();
              soapLogger.info('Recibida solicitud EstadoDocumento', {
                requestId,
                args: JSON.stringify(args)
              });

              try {
                const { tokenEmpresa, tokenPassword, documento } = args;

                if (!tokenEmpresa || !tokenPassword || !documento) {
                  throw new Error('Faltan datos requeridos: tokenEmpresa, tokenPassword o documento');
                }

                return {
                  EstadoDocumentoResult: {
                    codigo: 200,
                    mensaje: 'Documento encontrado',
                    resultado: 'Procesado',
                    procesado: true,
                    fechaRespuesta: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    hash: createHash('sha384').update(documento).digest('hex')
                  }
                };

              } catch (error) {
                soapLogger.error('Error procesando solicitud EstadoDocumento', {
                  requestId,
                  error: error.message,
                  stack: error.stack
                });

                return {
                  EstadoDocumentoResult: {
                    codigo: 500,
                    mensaje: error.message,
                    resultado: 'Error',
                    procesado: false,
                    fechaRespuesta: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    hash: createHash('sha384').update(error.message).digest('hex')
                  }
                };
              }
            }
          }
        }
      };

      const xml = fs.readFileSync(this.wsdlPath, 'utf8');

      await new Promise<void>((resolve, reject) => {
        soap.listen(this.server, '/ws/v1.0/Service.svc', serviceObject, xml, (err) => {
          if (err) {
            soapLogger.error('Error al iniciar servidor SOAP', {
              error: err.message,
              stack: err.stack
            });
            reject(err);
            return;
          }
          resolve();
        });
      });

      this.server.listen(8080, () => {
        soapLogger.info('Servidor SOAP iniciado', {
          endpoint: 'http://localhost:8080/ws/v1.0/Service.svc',
          wsdl: 'http://localhost:8080/ws/v1.0/Service.svc?wsdl',
          startTime: new Date().toISOString()
        });
      });

    } catch (error) {
      soapLogger.error('Error crítico al iniciar servidor SOAP', {
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  private async logRequest(filename: string, data: any) {
    const logPath = path.join(process.cwd(), 'logs', filename);
    const logEntry = `[${new Date().toISOString()}] REQUEST: ${JSON.stringify(data, null, 2)}\n`;

    await fs.promises.appendFile(logPath, logEntry).catch(err => {
      this.logger.error('Error escribiendo log de request', err);
    });
  }

  private async logError(filename: string, error: any) {
    const logPath = path.join(process.cwd(), 'logs', filename);
    const logEntry = `[${new Date().toISOString()}] ERROR: ${error.message}\nStack: ${error.stack}\n`;

    await fs.promises.appendFile(logPath, logEntry).catch(err => {
      this.logger.error('Error escribiendo log de error', err);
    });
  }
} 