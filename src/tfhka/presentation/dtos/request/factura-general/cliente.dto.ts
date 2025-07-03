import { DestinatarioDto } from './destinatario.dto';
import { ExtensibleDto } from './extensible.dto';
import { DireccionDto } from './direccion.dto';
import { InformacionLegalClienteDto } from './informacion-legal-cliente.dto';
import { ObligacionesDto } from './obligaciones.dto';

export class ClienteDto {
    actividadEconomicaCIIU?: string;
    destinatario?: DestinatarioDto[];
    detallesTributarios?: ExtensibleDto[];
    direccion: DireccionDto;
    email: string;
    informacionLegalCliente: InformacionLegalClienteDto;
    nombreCompleto: string;
    nombreRegistrado?: string;
    notificar: string;
    numeroDocumento: string;
    numeroIdentificacionDV?: string;
    obligacionesCliente: ObligacionesDto[];
    pais: string;
    regimen: string;
    telefono: string;
    tipoDocumento: string;
    tipoPersona: string;
} 