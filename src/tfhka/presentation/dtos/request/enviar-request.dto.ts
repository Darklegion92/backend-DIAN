import { FacturaGeneralDto } from "./factura-general/factura-general.dto";

export class EnviarRequestDto {
    tokenEmpresa: string;
    tokenPassword: string;
    factura: FacturaGeneralDto;
    adjuntos: string;
} 