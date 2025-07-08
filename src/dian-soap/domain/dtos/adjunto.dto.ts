export class AdjuntoDto {
  archivo: Buffer;           // Arreglo de bytes del archivo
  email: string[] | {string: string};          // Correos destinatarios
  enviar: '0' | '1';        // 0: Solo adjunta, 1: Adjunta y envía
  formato: string;          // Extensión del archivo (png, bmp, jpg, pdf, doc, docx, xls, xlsx, ppt, pptx, rar)
  nombre: string;           // Nombre del archivo adjunto
  numeroDocumento: string;  // Prefijo y consecutivo concatenado (ej: "PRUE980338212")
  tipo: '1' | '2';         // 1: Representación gráfica ERP, 2: Documento anexo
}

export class CargarAdjuntosRequestDto {
  tokenEmpresa: string;
  tokenPassword: string;
  adjunto: AdjuntoDto;
}

export class CargarAdjuntosResponseDto {
  codigo: number;
  mensaje: string;
  mensajesValidacion: string[];
  resultado: string;
}

export class EliminarAdjuntosRequestDto {
  tokenEmpresa: string;
  tokenPassword: string;
  numeroDocumento: string;
}

export class EliminarAdjuntosResponseDto {
  codigo: number;
  mensaje: string;
  mensajesValidacion: string[];
  resultado: string;
} 