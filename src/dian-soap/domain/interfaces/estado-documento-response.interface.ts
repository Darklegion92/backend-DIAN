import { IEvento } from './evento.interface';
import { IHistorialDeEntregas } from './historial-de-entregas.interface';

export interface IEstadoDocumentoResponse {
  EstadoDocumentoResult: {
    aceptacionFisica: boolean;
    acuseComentario: string;
    acuseEstatus: string;
    acuseResponsable: string;
    acuseRespuesta: string;
    ambiente: string;
    cadenaCodigoQR: string;
    cadenaCufe: string;
    Codigo: number;
    consecutivo: string;
    cufe: string;
    DescriptionDocumento: string;
    DescriptionEstatusDocumento: string;
    entregaMetodoDIAN: string;
    esValidoDIAN: boolean;
    estatusDocumento: string;
    eventos: IEvento[];
    fechaAceptacionDIAN: string;
    fechaDocumento: string;
    historialDeEntregas: IHistorialDeEntregas[];
    mensaje: string;
    mensajeDocumento: string;
    poseeAdjuntos: boolean;
    poseeRepresentacionGrafica: boolean;
    reglasValidacionDIAN: string[];
    resultado: string;
    tipoCufe: string;
    tipoDocumento: string;
    trackID: string;
  };
} 