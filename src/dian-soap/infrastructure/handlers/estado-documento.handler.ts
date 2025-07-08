import { Injectable } from '@nestjs/common';
import { IEstadoDocumentoRequest } from '../../domain/interfaces/estado-documento-request.interface';
import { IEstadoDocumentoResponse } from '../../domain/interfaces/estado-documento-response.interface';
import { soapLogger } from '../services/logger.service'; 
import { DocumentService } from '@/document/infrastructure/services/document.service';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { CompanyService } from '@/company/application/services/company.service';
import { Document } from '@/document/domain/entities/document.entity';

@Injectable()
export class EstadoDocumentoHandler {
  constructor(private readonly documentService: DocumentService, 
    private readonly generateDataService: GenerateDataService,
    private readonly companyService: CompanyService) {}

  async handle(args: IEstadoDocumentoRequest): Promise<IEstadoDocumentoResponse> {
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

      let { number, prefix } = this.generateDataService.getNumberAndPrefixString(documento);

      const company = await this.companyService.getCompanyByTokenEmpresa(tokenEmpresa);

      if(prefix === "SETP"){
        number = number + 990080000;
      }


      const document:Document = await this.documentService.getDocument(prefix, number.toString(), company.identificationNumber);

      if(!document){
        return  {
          EstadoDocumentoResult: {
            aceptacionFisica: false,
            acuseComentario: '',
            acuseEstatus: '',
            acuseResponsable: '',
            acuseRespuesta: '',
            ambiente: '',
            cadenaCodigoQR: '',
            cadenaCufe: '',
            Codigo: 500,
            consecutivo: '',
            cufe: '',
            DescriptionDocumento: '',
            DescriptionEstatusDocumento: '',
            entregaMetodoDIAN: '',
            esValidoDIAN: false,
            estatusDocumento: 'ERROR',
            eventos: [],
            fechaAceptacionDIAN: '',
            fechaDocumento: '',
            historialDeEntregas: [],
            mensaje: "No se pudo validar el documento",
            mensajeDocumento: "Documento no encontrado",
            poseeAdjuntos: false,
            poseeRepresentacionGrafica: false,
            reglasValidacionDIAN: [],
            resultado: 'Error',
            tipoCufe: '',
            tipoDocumento: '',
            trackID: '',
          },
        };
      }

      return {
        EstadoDocumentoResult: {
          aceptacionFisica: true,
          acuseComentario: 'Comentario de acuse de recibo.',
          acuseEstatus: '1',
          acuseResponsable: 'acquirer@example.com',
          acuseRespuesta: '1',
          ambiente: '1',
          cadenaCodigoQR: 'mnvbghjkghjkgjkh',
          cadenaCufe: 'Cadena de ejemplo para el CUFE',
          Codigo: 200,
          consecutivo: documento,
          cufe: document.cufe,
          DescriptionDocumento: 'Factura de Venta Nacional',
          DescriptionEstatusDocumento: 'Procesado Correctamente',
          entregaMetodoDIAN: 'Asincrónico',
          esValidoDIAN: true,
          estatusDocumento: 'DIAN_PROCESSED',
          eventos: [],
          fechaAceptacionDIAN: document.dateIssue.toISOString().slice(0, 19).replace('T', ' '),
          fechaDocumento: document.createdAt.toISOString().slice(0, 19).replace('T', ' '),
          historialDeEntregas: [],
          mensaje: 'Documento encontrado',
          mensajeDocumento: '',
          poseeAdjuntos: false,
          poseeRepresentacionGrafica: true,
          reglasValidacionDIAN: [],
          resultado: 'Procesado',
          tipoCufe: 'SHA-384',
          tipoDocumento: '01',
          trackID: 'track-id-ejemplo-12345',
        },
      };
    } catch (error) {

      return {
        EstadoDocumentoResult: {
          aceptacionFisica: false,
          acuseComentario: '',
          acuseEstatus: '0',
          acuseResponsable: '',
          acuseRespuesta: '0',
          ambiente: '',
          cadenaCodigoQR: '',
          cadenaCufe: '',
          Codigo: 500,
          consecutivo: '',
          cufe: '',
          DescriptionDocumento: '',
          DescriptionEstatusDocumento: '',
          entregaMetodoDIAN: '',
          esValidoDIAN: false,
          estatusDocumento: 'ERROR',
          eventos: [],
          fechaAceptacionDIAN: '',
          fechaDocumento: '',
          historialDeEntregas: [],
          mensaje: error.message,
          mensajeDocumento: error.message,
          poseeAdjuntos: false,
          poseeRepresentacionGrafica: false,
          reglasValidacionDIAN: [],
          resultado: 'Error',
          tipoCufe: '',
          tipoDocumento: '',
          trackID: '',
        },
      };
    }
  }
} 