import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { CompanyService } from '@/company/application/services/company.service';
import { DocumentService } from '@/document/infrastructure/services/document.service';
import { ProcessInvoiceUseCase } from '@/invoice/application/use-cases/process-invoice.use-case';
import { EnviarResponseDto, MensajeValidacion } from '@/dian-soap/presentation/dtos/response/enviar-response.dto';
import { DocumentTransformerFactory } from '../services/transformers/document-transformer.factory';
import { soapLogger } from '../services/logger.service';

@Injectable()
export class EnviarHandler {
  constructor(
    private readonly documentTransformerFactory: DocumentTransformerFactory,
    private readonly processInvoiceUseCase: ProcessInvoiceUseCase,
    private readonly companyService: CompanyService,
    private readonly documentService: DocumentService,
  ) {}

  async handle(args: any): Promise<{ EnviarResult: EnviarResponseDto }> {
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

      const company = await this.companyService.getCompanyByTokenEmpresa(tokenEmpresa);

      if (!company || company.tokenPassword !== tokenPassword) {
        return {
          EnviarResult: new EnviarResponseDto({
            codigo: 401,
            consecutivoDocumento: factura.consecutivoDocumento || `PRUE${Date.now()}`,
            esValidoDian: false,
            mensaje: 'Token o contraseña incorrectos',
            mensajesValidacion: [],
          })
        };
      }

      const documentoTransformado = await this.documentTransformerFactory.transform(factura, company.id, adjuntos);

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

        const mensajesValidacion: MensajeValidacion[] = [];

        if (body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.string) {
          mensajesValidacion.push({
            codigo: "401",
            mensaje: body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.string
          });
        } else if (body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.strings) {
          body?.SendBillSyncResponse?.SendBillSyncResult.ErrorMessage?.strings.forEach(mensaje => {
            mensajesValidacion.push({
              codigo: "401",
              mensaje: mensaje
            });
          });
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
            const qrString = "";
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

      // Default empty response if logic falls through, though it shouldn't.
      return {
        EnviarResult: new EnviarResponseDto({
          codigo: 500,
          consecutivoDocumento: factura.consecutivoDocumento,
          esValidoDian: false,
          mensaje: 'Error interno del servidor',
          mensajesValidacion: [],
        }),
      };
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
  }
} 