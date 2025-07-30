export interface MensajeValidacion {
  codigo: string;
  mensaje: string;
  estado: string;
}

export interface ReglaValidacion {
  codigo: string;
  mensaje: string;
  estado: string;
}

export class EnviarResponseDto {
  // Campos según la documentación del método Enviar
  codigo: number;
  consecutivoDocumento: string;
  cufe: string;
  esValidoDian: boolean;
  fechaAceptacionDIAN: string;
  fechaRespuesta: string;
  hash: string;
  mensaje: string;
  mensajesValidacion: MensajeValidacion[];
  nombre: string;
  qr: string;
  reglasNotificacionDIAN: ReglaValidacion[];
  reglasValidacionDIAN: string[];
  resultado: 'Procesado' | 'Error';
  tipoCufe: 'CUFE-SHA384' | 'CUDE-SHA384';
  xml: string;

  constructor(partial: Partial<EnviarResponseDto>) {
    Object.assign(this, partial);
    
    // Asegurar formato de fecha AAAA-MM-DD HH:MM:SS
    if (!this.fechaRespuesta) {
      this.fechaRespuesta = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }
    if (!this.fechaAceptacionDIAN) {
      this.fechaAceptacionDIAN = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    // Inicializar arrays si no existen
    this.mensajesValidacion = this.mensajesValidacion || [];
    this.reglasNotificacionDIAN = this.reglasNotificacionDIAN || [];
    this.reglasValidacionDIAN = this.reglasValidacionDIAN || [];
  }
} 