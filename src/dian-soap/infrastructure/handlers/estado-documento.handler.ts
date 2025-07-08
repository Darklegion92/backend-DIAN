import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { soapLogger } from '../services/logger.service';

@Injectable()
export class EstadoDocumentoHandler {
  async handle(args: any): Promise<any> {
    const requestId = Date.now().toString();
    soapLogger.info('Recibida solicitud EstadoDocumento', {
      requestId,
      args: JSON.stringify(args),
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
          hash: createHash('sha384').update(documento).digest('hex'),
        },
      };
    } catch (error) {
      soapLogger.error('Error procesando solicitud EstadoDocumento', {
        requestId,
        error: error.message,
        stack: error.stack,
      });

      return {
        EstadoDocumentoResult: {
          codigo: 500,
          mensaje: error.message,
          resultado: 'Error',
          procesado: false,
          fechaRespuesta: new Date().toISOString().slice(0, 19).replace('T', ' '),
          hash: createHash('sha384').update(error.message).digest('hex'),
        },
      };
    }
  }
} 