import { Injectable, Logger } from '@nestjs/common';
import { CompanyService } from '@/company/application/services/company.service';
import { DocumentService } from '@/document/infrastructure/services/document.service';
import { soapLogger } from './logger.service';
import {
  CargarAdjuntosRequestDto,
  CargarAdjuntosResponseDto,
  EliminarAdjuntosRequestDto,
  EliminarAdjuntosResponseDto,
} from '../../domain/dtos/adjunto.dto';
import { CompanyWithCertificateDto } from '@/company/presentation/dtos/company-with-certificate.dto';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { MailService } from '@/common/infrastructure/services/mail.service';

@Injectable()
export class AdjuntosSoapService {

  constructor(
    private readonly companyService: CompanyService,
    private readonly documentService: DocumentService,
    private readonly generateDataService: GenerateDataService,
    private readonly mailService: MailService,
  ) { }

  async cargarAdjuntos(
    args: CargarAdjuntosRequestDto,
  ): Promise<{ CargarAdjuntosResult: CargarAdjuntosResponseDto }> {
    const requestId = Date.now().toString();
    soapLogger.info('Recibida solicitud CargarAdjuntos', {
      requestId,
      args: JSON.stringify({
        ...args,
        adjunto: { ...args.adjunto, archivo: 'Buffer omitido del log' },
      }),
    });

    try {
      const { tokenEmpresa, tokenPassword, adjunto } = args;

      if (!tokenEmpresa || !tokenPassword || !adjunto || !adjunto.numeroDocumento) {
        throw new Error('Faltan datos requeridos: tokenEmpresa, tokenPassword o adjunto.numeroDocumento');
      }

      if (adjunto.tipo === "2") {
        return {
          CargarAdjuntosResult: {
            codigo: 400,
            mensaje: 'El tipo de documento no es admitido por el momento',
            mensajesValidacion: [],
            resultado: 'Error',
          },
        };
      }  

      const company = await this.companyService.getCompanyByTokenEmpresa(tokenEmpresa);


      let { number, prefix } = this.generateDataService.getNumberAndPrefixString(adjunto.numeroDocumento);


      if (prefix === "SETP") {
        number = number + 990080000;
      }

      const document = await this.documentService.getDocument(prefix, number.toString(), company.identificationNumber);

      let email_cc_list;
      let firstEmail;
      if(Array.isArray(adjunto.email)){
        email_cc_list = adjunto?.email?.map((email) => ({ email }));
        firstEmail = adjunto.email[0];
      }else{
        email_cc_list = [{email: adjunto.email.string}];
        firstEmail = adjunto.email.string;
      }

      const sendEmail = this.generateDataService.sendEmail(firstEmail, document.clientId, company.identificationNumber);

      if (!sendEmail) {
        return {
          CargarAdjuntosResult: {
            codigo: 200,
            mensaje: 'El cliente es ocasional, no se envía correo',
            mensajesValidacion: [],
            resultado: 'Procesado',
          },
        };
      }

      const authResult = this.authenticateCompany(company, tokenPassword);
      if (authResult) {
        return { CargarAdjuntosResult: authResult };
      }

      soapLogger.info(`XML para documento ${adjunto.numeroDocumento} obtenido con éxito.`, { requestId });

      if (!document) {
        return {
          CargarAdjuntosResult: {
            codigo: 404,
            mensaje: 'Documento no encontrado',
            mensajesValidacion: [],
            resultado: 'Error',
          },
        };
      }

      
        try {
          const body = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
              <div style="background-color: #e75c0b; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">Notificación de Documento Electrónico</h1>
              </div>
              <div style="padding: 25px; background-color: #f9f9f9;">
                <p>Estimado(a) cliente,</p>
                <p>Le informamos que se ha generado un nuevo documento electrónico asociado a su cuenta.</p>
                <div style="background-color: #ffffff; padding: 20px; border-left: 5px solid #f67615; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #f67615;">Detalles del Documento</h3>
                  <p><strong>Documento No:</strong> ${document.prefix}${document.number}</p>
                  <p><strong>Generado por:</strong> ${company.usuarioDian || company.mailFromName}</p>
                  <p><strong>Fecha de Emisión:</strong> ${new Date(document.dateIssue).toLocaleDateString('es-CO')}</p>
                </div>
                <p>Encontrará el archivo adjunto a este correo, el cual contiene la representación gráfica del documento en formato PDF y el archivo XML correspondiente.</p>
                <p>Gracias por su confianza.</p>
                <p>Atentamente,<br/><strong>El equipo de SOLTEC - Tecnología y Desarrollo.</strong></p>
              </div>
              <div style="background-color: #f2f2f2; color: #666; padding: 15px; text-align: center; font-size: 12px;">
                <p>Este es un correo electrónico generado automáticamente. Por favor, no responda a este mensaje.</p>
                <p>&copy; ${new Date().getFullYear()} SOLTEC - Tecnología y Desarrollo. Todos los derechos reservados.</p>
              </div>
            </div>
          `;

         

          const response = await this.mailService.sendMailWithCompanyConfig({
            prefix,
            number: number.toString(),
            token: company.tokenDian,
            email_cc_list,
            html_body: body,
            base64graphicrepresentation: adjunto.archivo.toString('base64'),
          });

          if (response.success) {
            return {
              CargarAdjuntosResult: {
                codigo: 200,
                mensaje: 'Adjunto procesado correctamente',
                mensajesValidacion: [],
                resultado: 'Procesado',
              },
            };
          }
          return {
            CargarAdjuntosResult: {
              codigo: 500,
              mensaje: 'Error al enviar el correo electrónico con adjunto',
              mensajesValidacion: [response.message],
              resultado: 'Error',
            },
          };


        } catch (emailError) {
          soapLogger.error('Error al intentar enviar el correo electrónico con adjunto', {
            requestId,
            error: emailError.message,
            stack: emailError.stack,
          });
          return {
            CargarAdjuntosResult: {
              codigo: 500,
              mensaje: 'Error al enviar el correo electrónico con adjunto',
              mensajesValidacion: [emailError.message],
              resultado: 'Error',
            },
          };
        }
    } catch (error) {
      soapLogger.error('Error procesando solicitud CargarAdjuntos', {
        requestId,
        error: error.message,
        stack: error.stack,
      });

      return {
        CargarAdjuntosResult: {
          codigo: 500,
          mensaje: error.message,
          mensajesValidacion: [],
          resultado: 'Error',
        },
      };
    }
  }

  private authenticateCompany(
    company: CompanyWithCertificateDto,
    tokenPassword,
  ): CargarAdjuntosResponseDto | null {
    if (!company || company.tokenPassword !== tokenPassword) {
      return {
        codigo: 401,
        mensaje: 'Token o contraseña incorrectos',
        mensajesValidacion: [],
        resultado: 'Error',
      };
    }
    return null;
  }

  private isValidFileContent(buffer: Buffer, format: string): boolean {
    if (buffer.length < 8) {
      return false;
    }

    const signatureHex = buffer.toString('hex', 0, 8);
    const signatureAscii = buffer.toString('ascii', 0, 4);

    switch (format) {
      case 'png':
        return signatureHex.startsWith('89504e47');
      case 'jpg':
        return signatureHex.startsWith('ffd8ff');
      case 'bmp':
        return signatureAscii.startsWith('BM');
      case 'pdf':
        return signatureAscii.startsWith('%PDF');
      case 'doc':
      case 'xls':
      case 'ppt':
        return signatureHex.startsWith('d0cf11e0a1b11ae1');
      case 'docx':
      case 'xlsx':
      case 'pptx':
        return signatureHex.startsWith('504b0304');
      case 'rar':
        return (
          signatureHex.startsWith('526172211a0700') ||
          signatureHex.startsWith('526172211a070100')
        );
      default:
        return true;
    }
  }

  async eliminarAdjuntos(
    args: EliminarAdjuntosRequestDto,
  ): Promise<{ EliminarAdjuntosResult: EliminarAdjuntosResponseDto }> {
    const requestId = Date.now().toString();
    soapLogger.info('Recibida solicitud EliminarAdjuntos', {
      requestId,
      args: JSON.stringify(args),
    });

    try {
      const { tokenEmpresa, tokenPassword, numeroDocumento } = args;

      if (!tokenEmpresa || !tokenPassword || !numeroDocumento) {
        throw new Error('Faltan datos requeridos: tokenEmpresa, tokenPassword o numeroDocumento');
      }

      const company = await this.companyService.getCompanyByTokenEmpresa(tokenEmpresa);

      if (!company || company.tokenPassword !== tokenPassword) {
        return {
          EliminarAdjuntosResult: {
            codigo: 401,
            mensaje: 'Token o contraseña incorrectos',
            mensajesValidacion: [],
            resultado: 'Error',
          },
        };
      }

      // TODO: Implementar lógica para eliminar los últimos adjuntos del documento

      return {
        EliminarAdjuntosResult: {
          codigo: 200,
          mensaje: 'Adjuntos eliminados correctamente',
          mensajesValidacion: [],
          resultado: 'Procesado',
        },
      };
    } catch (error) {
      soapLogger.error('Error procesando solicitud EliminarAdjuntos', {
        requestId,
        error: error.message,
        stack: error.stack,
      });

      return {
        EliminarAdjuntosResult: {
          codigo: 500,
          mensaje: error.message,
          mensajesValidacion: [],
          resultado: 'Error',
        },
      };
    }
  }
} 