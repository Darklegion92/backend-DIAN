import { DatosTransportistasDto } from './datos-transportistas.dto';
import { DireccionDto } from './direccion.dto';
import { TerminosEntregaDto } from './terminos-entrega.dto';

export class EntregaMercanciaDto {
    datosTransportistas?: DatosTransportistasDto[];
    direccion?: DireccionDto;
    fechaEstimada?: string;
    fechaReal?: string;
    identificacionTransportador?: string;
    identificacionTransportadorDV?: string;
    modalidadTransporte?: string;
    nombreTransportador?: string;
    pais?: string;
    terminosEntrega?: TerminosEntregaDto;
    tipoIdentificacionTransportador?: string;
} 