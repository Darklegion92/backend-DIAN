import { CoordenadasDto } from './coordenadas.dto';
import { DireccionDto } from './direccion.dto';

export class TerminosEntregaDto {
    codigo: string;
    coordenadas: CoordenadasDto[];
    direccion: DireccionDto;
} 