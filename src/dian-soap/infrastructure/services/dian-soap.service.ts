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
  ) {
    // Busca el archivo WSDL en el directorio src o dist
    const srcPath = path.join(__dirname, '..', 'wsdl', 'dian.wsdl');
    const distPath = path.join(__dirname, '..', '..', '..', 'src', 'dian-soap', 'infrastructure', 'wsdl', 'dian.wsdl');

    this.wsdlPath = fs.existsSync(srcPath) ? srcPath : distPath;

    if (!fs.existsSync(this.wsdlPath)) {
      throw new Error(`WSDL file not found at ${this.wsdlPath}`);
    }

    this.server = express();
    
    // Configurar body-parser para manejar XML SOAP
    this.server.use(bodyParser.raw({ 
      type: () => true, 
      limit: '50mb',
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      }
    }));
    
    // Middleware de logging mejorado
    this.server.use((req, res, next) => {
      soapLogger.info('Petición entrante', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.method === 'POST' ? req.body : undefined,
        rawBodyLength: req.rawBody ? req.rawBody.length : 0
      });
      next();
    });

    // Middleware para manejar errores de parsing
    this.server.use((err, req, res, next) => {
      soapLogger.error('Error del servidor', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
      });
      next(err);
    });
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
          soapLogger.info('Servidor SOAP configurado correctamente');
          resolve();
        });
      });

      this.server.listen(8081, () => {
        soapLogger.info('Servidor SOAP iniciado', {
          endpoint: 'http://localhost:8081/ws/v1.0/Service.svc',
          wsdl: 'http://localhost:8081/ws/v1.0/Service.svc?wsdl',
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
} 