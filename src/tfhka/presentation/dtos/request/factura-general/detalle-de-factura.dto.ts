import { ExtensibleDto } from './extensible.dto';
import { DocumentoReferenciaDto } from './documento-referencia.dto';
import { FacturaImpuestosDto } from './factura-impuestos.dto';
import { ImpuestosTotalesDto } from './impuestos-totales.dto';

export class DetalleDeFacturaDto {
    cantidad: number;
    cantidadPorEmpaque?: number;
    cantidadReal?: number;
    codigoProducto: string;
    descripcion: string;
    descuento?: number;
    detalleExtras?: ExtensibleDto[];
    documentoReferencia?: DocumentoReferenciaDto;
    estandarCodigo?: string;
    estandarCodigoProducto?: string;
    impuestosDetalles?: FacturaImpuestosDto[];
    impuestosTotales: ImpuestosTotalesDto[];
    marca?: string;
    modelo?: string;
    muestraComercial?: boolean;
    nombreProducto: string;
    nota?: string;
    precio: number;
    precioAlternativo?: number[];
    recargo?: number;
    secuencia: number;
    subTotal: number;
    total: number;
    unidadMedida: string;
    valorICE?: number;
    valorIRBPNR?: number;
} 