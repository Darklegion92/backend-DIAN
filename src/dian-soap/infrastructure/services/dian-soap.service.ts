import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as soap from 'soap';
import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { soapLogger } from './logger.service';
import { AdjuntosSoapService } from './adjuntos-soap.service';
import { EnviarHandler } from '../handlers/enviar.handler';
import { EstadoDocumentoHandler } from '../handlers/estado-documento.handler';
import { EnvioCorreoHandler } from '../handlers/envio-correo.handler';
import { DescargaPdfHandler } from '../handlers/descarga-pdf.handler';
import { HttpAdapterHost } from '@nestjs/core';

// Extender la interfaz Request para incluir rawBody
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

@Injectable()
export class DianSoapService implements OnModuleInit {
  private wsdlPath: string;
  private server: express.Express;
  private readonly logger = new Logger(DianSoapService.name);

  constructor(
    private readonly adjuntosSoapService: AdjuntosSoapService,
    private readonly enviarHandler: EnviarHandler,
    private readonly estadoDocumentoHandler: EstadoDocumentoHandler,
    private readonly envioCorreoHandler: EnvioCorreoHandler,
    private readonly descargaPdfHandler: DescargaPdfHandler,
    private readonly adapterHost: HttpAdapterHost,
  ) {
    // Busca el archivo WSDL en diferentes ubicaciones posibles (desarrollo y producción)
    const pathsToTry = [
      path.resolve(__dirname, '..', 'wsdl', 'dian.wsdl'),
      path.resolve(__dirname, '..', '..', 'wsdl', 'dian.wsdl'), // Por si acaso la estructura en dist es diferente
      path.resolve(process.cwd(), 'src', 'dian-soap', 'infrastructure', 'wsdl', 'dian.wsdl'),
      path.resolve(process.cwd(), 'dist', 'dian-soap', 'infrastructure', 'wsdl', 'dian.wsdl'),
    ];

    this.wsdlPath = pathsToTry.find(p => fs.existsSync(p));

    if (!this.wsdlPath) {
      throw new Error(`WSDL file not found at any of the locations: ${pathsToTry.join(', ')}`);
    }
  }

  async onModuleInit() {
    try {
      const serviceObject = {
        Service: {
          ServiceSoap: {
            Enviar: (args: any) => {
              soapLogger.info('Invocando Enviar desde serviceObject', { args });
              return this.enviarHandler.handle(args);
            },
            EstadoDocumento: (args: any) => {
              soapLogger.info('Invocando EstadoDocumento desde serviceObject', { args });
              return this.estadoDocumentoHandler.handle(args);
            },
            EnvioCorreo: (args: any) => {
              soapLogger.info('Invocando EnvioCorreo desde serviceObject', { 
                args,
                argsType: typeof args,
                argsKeys: args ? Object.keys(args) : 'null'
              });
              return this.envioCorreoHandler.handle(args);
            },
            DescargaPDF: (args: any) => {
              soapLogger.info('Invocando DescargaPDF desde serviceObject', { args });
              return this.descargaPdfHandler.handle(args);
            },
            CargarAdjuntos: async (args: any) => {
              soapLogger.info('Invocando CargarAdjuntos desde serviceObject');
              return this.adjuntosSoapService.cargarAdjuntos(args);
            },
            EliminarAdjuntos: async (args: any) => {
              soapLogger.info('Invocando EliminarAdjuntos desde serviceObject');
              return this.adjuntosSoapService.eliminarAdjuntos(args);
            },
          },
        },
      };

      const xml = fs.readFileSync(this.wsdlPath, 'utf8');

      const expressApp = this.adapterHost.httpAdapter.getInstance();

      // Configurar body-parser raw específicamente para la ruta SOAP
      expressApp.use('/ws/v1.0/Service.svc', bodyParser.raw({ 
        type: () => true, 
        limit: '50mb',
        verify: (req: any, res, buf) => {
          req.rawBody = buf;
        }
      }));

      // Middleware de logging para la ruta SOAP
      expressApp.use('/ws/v1.0/Service.svc', (req, res, next) => {
        soapLogger.info('Petición entrante SOAP', {
          method: req.method,
          url: req.url,
          headers: req.headers,
          rawBodyLength: req.rawBody ? req.rawBody.length : 0
        });
        next();
      });

      await new Promise<void>((resolve, reject) => {
        soap.listen(expressApp as any, '/ws/v1.0/Service.svc', serviceObject, xml, (err) => {
          if (err) {
            soapLogger.error('Error al iniciar servidor SOAP', {
              error: err.message,
              stack: err.stack
            });
            reject(err);
            return;
          }
          soapLogger.info('Servidor SOAP expuesto en el puerto principal (3000) bajo /ws/v1.0/Service.svc');
          resolve();
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
} 