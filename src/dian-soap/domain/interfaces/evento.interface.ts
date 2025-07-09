import { IExtrasEvento } from './extras-evento.interface';

export interface IEvento {
  ambienteDIAN: string;
  codigo: string;
  comentario: string;
  cufe: string;
  DescriptionEvento: string;
  emisorNumeroDocumento: string;
  emisorNumeroDocumentoDV: string;
  emisorRazonSocial: string;
  emisorTipoIdentificacion: string;
  extras: IExtrasEvento[];
  fechaEmision: string;
  fechaRecepcion: string;
  hash: string;
  idPerfilDIAN: string;
  mensaje: string;
  nombreArchivoXML: string;
  nota: string;
  numeroDelEvento: string;
  receptorNumeroDocumento: string;
  receptorNumeroDocumentoDV: string;
  receptorRazonSocial: string;
  receptorTipoIdentificacion: string;
  resultado: string;
  tipoCufe: string;
  tipoEvento: string;
  versionUBL: string;
} 