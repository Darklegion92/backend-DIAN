import { FacturaGeneralDto } from './factura-general.dto';

/**
 * Tipo de adjuntos permitidos
 * "0" No se admiten adjuntos. Se genera XML y representación Gráfica estándar
 * "1" Admite archivos adjuntos. Se genera XML y representación Gráfica estándar
 * "10" No se admiten adjuntos. Se genera sólo XML sin representación Gráfica
 * "11" Admite archivos adjuntos. Se genera sólo XML sin representación gráfica
 */
export type TipoAdjunto = '0' | '1' | '10' | '11';

export interface EnviarRequestDto {
  /**
   * Token suministrado por el proveedor tecnológico
   */
  tokenEmpresa: string;

  /**
   * Password del token
   */
  tokenPassword: string;

  /**
   * Objeto que contiene la información de la factura
   */
  factura: FacturaGeneralDto;

  /**
   * Tipo de adjuntos permitidos
   * @see TipoAdjunto
   */
  adjuntos: TipoAdjunto;
}

// Validador para el request
export class EnviarRequestValidator {
  static validate(request: EnviarRequestDto): boolean {
    if (!request) return false;

    // Validar campos requeridos
    if (!request.tokenEmpresa || !request.tokenPassword) {
      return false;
    }

    // Validar que el tipo de adjunto sea válido
    if (!['0', '1', '10', '11'].includes(request.adjuntos)) {
      return false;
    }

    // Validar que exista la factura
    if (!request.factura) {
      return false;
    }

    // Si los adjuntos son "1" u "11", el email del cliente es requerido
    if (['1', '11'].includes(request.adjuntos)) {
      if (!request.factura.cliente?.email) {
        return false;
      }
      // Y el campo notificar debe estar en "SI"
      if (request.factura.cliente?.notificar !== 'SI') {
        return false;
      }
    }

    return true;
  }
} 