import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as soap from 'soap';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import { SendBillDto } from '../../domain/dtos/send-bill.dto';
import { GetStatusDto } from '../../domain/dtos/get-status.dto';
import { soapLogger } from './logger.service';
import { EnviarRequestDto } from '../../presentation/dtos/enviar-request.dto';
import { EnviarResponseDto } from '../../presentation/dtos/response/enviar-response.dto';
import { createHash } from 'crypto';
import { DocumentTransformerFactory } from './transformers/document-transformer.factory';

@Injectable()
export class DianSoapService implements OnModuleInit {
  private wsdlPath: string;
  private server: express.Express;
  private readonly logger = new Logger(DianSoapService.name);

  constructor(
    private readonly documentTransformerFactory: DocumentTransformerFactory
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
                const { tokenEmpresa, tokenPassword, factura, adjuntos } = args;

                if (!tokenEmpresa || !tokenPassword || !factura) {
                  throw new Error('Faltan datos requeridos: tokenEmpresa, tokenPassword o factura');
                }
                // Transformar el request según el tipo de documento usando la fábrica

                console.log("factura", factura);
                //TODO: pendiente extraer el companyId de token empresa
                const documentoTransformado = await this.documentTransformerFactory.transform(factura, 1);

                console.log("documentoTransformado", documentoTransformado);

                soapLogger.info('Documento transformado', {
                  requestId,
                  tipoDocumento: factura.tipoDocumento,
                  documentoTransformado
                }); 

     
                const response = new EnviarResponseDto({
                  //codigo: 200,
                  consecutivoDocumento: factura.consecutivoDocumento || `PRUE${Date.now()}`,
                 // cufe,
                  esValidoDian: true,
                  fechaAceptacionDIAN: new Date().toISOString().slice(0, 19).replace('T', ' '),
                 // hash: createHash('sha384').update(xmlAttachedDocument).digest('hex'),
                  //mensaje: 'Documento procesado correctamente',
                  mensajesValidacion: [],
                  //nombre: 'DOCUMENTO_PROCESADO',
                  //qr: `https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=${cufe}`,
                  reglasNotificacionDIAN: [],
                  reglasValidacionDIAN: [],
                  //resultado: 'Procesado',
                  //tipoCufe: 'CUFE-SHA384',
                  //xml: Buffer.from(xmlAttachedDocument).toString('base64')
                });

                soapLogger.info('Solicitud Enviar completada', {
                  requestId,
                  resultado: response.resultado,
                  cufe: response.cufe
                });

                return { EnviarResult: response };

              } catch (error) {
                soapLogger.error('Error procesando solicitud Enviar', {
                  requestId,
                  error: error.message,
                  stack: error.stack
                });

                const xmlError = `
                  <?xml version="1.0" encoding="UTF-8"?>
                  <Error>
                    <Message>${error.message}</Message>
                  </Error>
                `;

                return {
                  EnviarResult: new EnviarResponseDto({
                    codigo: 500,
                    consecutivoDocumento: '',
                    cufe: '',
                    esValidoDian: false,
                    fechaAceptacionDIAN: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    hash: createHash('sha384').update(xmlError).digest('hex'),
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
                    xml: Buffer.from(xmlError).toString('base64')
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