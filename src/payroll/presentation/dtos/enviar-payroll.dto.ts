import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString, IsOptional, IsArray, IsNumber, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTOs para el método Enviar de Nómina Electrónica DIAN
 * Basado en la documentación oficial de The Factory HKA Colombia
 * https://felcowiki.thefactoryhka.com.co/index.php/Métodos_Servicio_Emisión_Nómina_Electrónica
 */

export class AnticipoNomDto {
  @ApiProperty({ description: 'Valor de anticipos de nómina', example: '300000' })
  @IsString()
  @IsOptional()
  montoanticipo?: string;  
}

export class FondoPensionDto {
  @ApiProperty({ description: 'Valor de los fondos de pensión', example: '300000' })
  @IsString()
  @IsNotEmpty()
  deduccion: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ description: 'Porcentaje de los fondos de pensión', example: '10' })
  @IsString()
  @IsNotEmpty()
  porcentaje: string;
}

export class FondoSPDto {
  @ApiProperty({ description: 'Valor de los fondos de seguridad pensional', example: '300000' })
  @IsString()
  @IsOptional()
  deduccionSP?: string;

  @ApiProperty({ description: 'Valor de la deducción subrogada', example: '300000' })
  @IsString()
  @IsOptional()
  deduccionSubrogada?: string;

  @ApiProperty({ description: 'Valor de la deducción subrogada', example: '300000' })
  @IsString()
  @IsOptional()
  porcentaje?: string;

  @ApiProperty({ description: 'Valor de la deducción subrogada', example: '300000' })
  @IsString()
  @IsOptional()
  porcentajeSub?: string;

}

export class LibranzaDto {
  @ApiProperty({ description: 'Valor de la libranza', example: '300000' })
  @IsString()
  @IsNotEmpty()
  descripción: string;

  @ApiProperty({ description: 'Valor de la deducción', example: '300000' })
  @IsString()
  @IsNotEmpty()
  deduccion: string;
}

export class OtraDeduccionDto {
  @ApiProperty({ description: 'Valor de la otra deducción', example: '300000' })
  @IsString()
  @IsOptional()
  montootraDeduccion?: string;
}

export class PagoTerceroDto {
  @ApiProperty({ description: 'Valor de los pagos a terceros (montopagotercero según API The Factory HKA)', example: '300000' })
  @IsString()
  @IsOptional()
  montopagotercero?: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @Allow()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[] | null;
}

export class SaludDto {
  @ApiProperty({ description: 'Valor de la salud', example: '300000' })
  @IsString()
  @IsNotEmpty()
  porcentaje: string;

  @ApiProperty({ description: 'Valor de la deducción', example: '300000' })
  @IsString()
  @IsNotEmpty()
  deduccion: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];
}

export class SancionDto {
  @ApiProperty({ description: 'Valor de la sanción', example: '300000' })
  @IsString()
  @IsNotEmpty()
  sancionPublic: string;

  @ApiProperty({ description: 'Valor de la sanción privada', example: '300000' })
  @IsString()
  @IsNotEmpty()
  sancionPriv: string;

}

export class SindicatoDto {
  @ApiProperty({ description: 'Valor de la sindicato', example: '300000' })
  @IsString()
  @IsNotEmpty()
  porcentaje: string;

  @ApiProperty({ description: 'Valor de la deducción', example: '300000' })
  @IsString()
  @IsNotEmpty()
  deduccion: string;
}

export class DeduccionesDto {
  @ApiProperty({ description: 'Corresponde a (Ahorro Fomento a la construcción)', type: String, required: false })
  @IsOptional()
  @IsString()
  afc?: string;

  @ApiProperty({ description: 'Utilizado para Todos los Elementos de Anticipos de Deducciones del Documento', type: [AnticipoNomDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnticipoNomDto)
  anticiposNom?: AnticipoNomDto[];

  @ApiProperty({ description: 'Las cuotas o aportes que los empleados hagan a las cooperativas legalmente constituidas', type: String, required: false })
  @IsOptional()
  @IsString()
  cooperativa?: string;

  @ApiProperty({ description: 'Valor que se deba pagar por las obligaciones que el empleado tenga con su empresa', type: String, required: false })
  @IsOptional()
  @IsString()
  deuda?: string;

  @ApiProperty({ description: 'Valor Pagado correspondiente a Conceptos Educativos por parte del trabajador', type: String, required: false })
  @IsOptional()
  @IsString()
  educacion?: string;

  @ApiProperty({ description: 'Valor Pagado correspondiente a Embargos Fiscales por parte del trabajador', type: String, required: false })
  @IsOptional()
  @IsString()
  embargoFiscal?: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @Allow()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[] | null;

  @ApiProperty({ description: 'Clase relacionada a las deducciones realizadas por motivos de fondos de pensión', type: [FondoPensionDto], required: false })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FondoPensionDto)
  fondosPensiones: FondoPensionDto[];

  @ApiProperty({ description: 'Clase relacionada a las deducciones realizadas por motivos de fondos de seguridad pensional', type: [FondoSPDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FondoSPDto)
  fondosSP?: FondoSPDto[];

  @ApiProperty({ description: 'Utilizado para Todos los Elementos de Libranzas de Deducciones del Documento', type: [LibranzaDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LibranzaDto)
  libranzas?: LibranzaDto[];

  @ApiProperty({ description: 'Utilizado para Todos los Elementos de Otras Deducciones del Documento', type: [OtraDeduccionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtraDeduccionDto)
  otrasDeducciones?: OtraDeduccionDto[];

  @ApiProperty({ description: 'Utilizado para Todos los Elementos de Pagos a Tercero de Devengos del Documento', type: [PagoTerceroDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PagoTerceroDto)
  pagosTerceros?: PagoTerceroDto[];

  @ApiProperty({ description: 'Valor correspondiente al ahorro que hace el trabajador para complementar su pensión obligatoria', type: String, required: false })
  @IsOptional()
  @IsString()
  pensionVoluntaria?: string;

  @ApiProperty({ description: 'Valor de planes complementarios de salud al que el trabajador se encuentran afiliado', type: String, required: false })
  @IsOptional()
  @IsString()
  planComplementarios?: string;

  @ApiProperty({ description: 'Valor correspondiente a retención en la fuente por ingresos laborales', type: String, required: false })
  @IsOptional()
  @IsString()
  retencionFuente?: string;

  @ApiProperty({ description: 'Valor que le regresa el trabajador a la empresa por un devengo mal realizado en otro pago de nómina', type: String, required: false })
  @IsOptional()
  @IsString()
  reintegro?: string;

  @ApiProperty({ description: 'Utilizado para Atributos de Salud del Documento', type: [SaludDto], required: false })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaludDto)
  salud: SaludDto[];

  @ApiProperty({ description: 'Utilizado para Todos los Elementos de Sanciones de Deducciones del Documento', type: [SancionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SancionDto)
  sanciones?: SancionDto[];

  @ApiProperty({ description: 'Utilizado para Todos los Elementos de Sindicatos de Deducciones del Documento', type: [SindicatoDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SindicatoDto)
  sindicatos?: SindicatoDto[];
}

// ============================================================================
// DTOs para Devengados
// ============================================================================

export class AnticiposNomDto {
  @ApiProperty({ description: 'Valor de anticipos de nómina', example: '300000' })
  @IsString()
  @IsOptional()
  montoanticipo?: string;
}

export class AuxilioDto {
  @ApiProperty({ description: 'Valor del auxilio no salarial', example: '140000' })
  @IsString()
  @IsOptional()
  auxilioNS?: string;

  @ApiProperty({ description: 'Valor del auxilio salarial', example: '140000' })
  @IsString()
  @IsOptional()
  auxilioS?: string;

}

export class BasicoDto {
  @ApiProperty({ description: 'Valor del salario básico', example: '1300000' })
  @IsString()
  @IsNotEmpty()
  diasTrabajados: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ description: 'Valor del salario trabajado', example: '1300000' })
  @IsString()
  @IsNotEmpty()
  sueldoTrabajado: string;
}

export class BonificacionDto {
  @ApiProperty({ description: 'Valor de la bonificación', example: '100000' })
  @IsString()
  @IsOptional()
  bonificacionNS?: string;

  @ApiProperty({ description: 'Valor de la bonificación salarial', example: '100000' })
  @IsString()
  @IsOptional()
  bonificacionS?: string;
}

export class BonoEPCTVDto {
  @ApiProperty({ description: 'Valor del bono EPCTV', example: '50000' })
  @IsString()
  @IsOptional()
  pagoAlimentacionNS?: string;

  @ApiProperty({ description: 'Valor de la bonificación salarial', example: '100000' })
  @IsString()
  @IsOptional()
  pagoAlimentacionS?: string;

  @ApiProperty({ description: 'Valor de la bonificación no salarial', example: '100000' })
  @IsString()
  @IsOptional()
  pagoNS?: string;

  @ApiProperty({ description: 'Valor de la bonificación salarial', example: '100000' })
  @IsString()
  @IsOptional()
  pagoS?: string;
}

export class CesantiaDto {
  @ApiProperty({ description: 'Valor de la cesantía', example: '150000' })
  @IsString()
  @IsNotEmpty()
  pago: string;

  @ApiProperty({ description: 'Valor de los intereses de la cesantía', example: '150000' })
  @IsString()
  @IsNotEmpty()
  pagoIntereses: string;

  @ApiProperty({ description: 'Porcentaje de la cesantía', example: '10' })
  @IsString()
  @IsNotEmpty()
  porcentaje: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

}

export class ComisionDto {
  @ApiProperty({ description: 'Valor de la comisión', example: '80000' })
  @IsString()
  @IsOptional()
  montoComision?: string;
}

export class CompensacionDto {
  @ApiProperty({ description: 'Valor de la compensación extraordinaria', example: '120000' })
  @IsString()
  @IsNotEmpty()
  compensacionE: string;

  @ApiProperty({ description: 'Valor de la compensación ordinaria', example: '120000' })
  @IsString()
  @IsNotEmpty()
  compensacionO: string;
}

export class HoraExtraDto {
  @ApiProperty({ description: 'Cantidad de Horas Extra según el tipo', example: '8' })
  @IsString()
  @IsNotEmpty()
  cantidad: string;

  @ApiProperty({ description: 'Hora de inicio de Hora Extra Según el tipo', example: '2024-01-31T18:00:00', required: false })
  @IsString()
  @IsOptional()
  horaInicio?: string;

  @ApiProperty({ description: 'Hora de fin de Hora Extra según el tipo', example: '2024-01-31T22:00:00', required: false })
  @IsString()
  @IsOptional()
  horaFin?: string;

  @ApiProperty({ description: 'Es el valor pagado por el tiempo que se trabaja adicional a la jornada legal o pactada contractualmente', example: '45000' })
  @IsString()
  @IsNotEmpty()
  pago: string;

  @ApiProperty({ description: 'Porcentaje al cual corresponde el calculo de 1 hora Extra según el tipo', example: '125' })
  @IsString()
  @IsNotEmpty()
  porcentaje: string;

  @ApiProperty({ description: 'Tipo de Hora Extra', example: '1' })
  @IsString()
  @IsNotEmpty()
  tipoHorasExtra: string;
}

export class HuelgaLegalDto {
  @ApiProperty({ description: 'Valor de huelga legal', example: '0' })
  @IsString()
  @IsNotEmpty()
  cantidad: string;

  @ApiProperty({ description: 'Fecha de inicio de la huelga legal', example: '2024-01-31' })
  @IsString()
  @IsNotEmpty()
  fechaInicio: string;

  @ApiProperty({ description: 'Fecha de fin de la huelga legal', example: '2024-01-31' })
  @IsString()
  @IsNotEmpty()
  fechaFin: string;
}

export class IncapacidadDto {
  @ApiProperty({ description: 'Número de días que el trabajador estuvo inactivo por incapacidad', example: '5' })
  @IsString()
  @IsNotEmpty()
  cantidad: string;

  @ApiProperty({ description: 'Fecha donde da inicio la huelga legalmente declarada', example: '2024-01-31', required: false })
  @IsString()
  @IsOptional()
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha fin de incapacidad del trabajador', example: '2024-02-05', required: false })
  @IsString()
  @IsOptional()
  fechaFin?: string;

  @ApiProperty({ description: 'Valor de la prestación económica pagada al trabajador por consecuencia de la falta de capacidad laboral', example: '150000' })
  @IsString()
  @IsNotEmpty()
  pago: string;

  @ApiProperty({ description: 'Se debe indicar el código al cual corresponda el tipo de incapacidad del Empleado', example: '1' })
  @IsString()
  @IsNotEmpty()
  tipo: string;
}

export class LicenciaMPDto {
  @ApiProperty({ description: 'Valor de licencia maternidad/paternidad', example: '0' })
  @IsString()
  @IsNotEmpty()
  cantidad: string;

  @ApiProperty({ description: 'Fecha de inicio de la licencia maternidad/paternidad', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha de fin de la licencia maternidad/paternidad', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaFin?: string;

  @ApiProperty({ description: 'Valor de la licencia maternidad/paternidad', example: '150000' })
  @IsString()
  @IsNotEmpty()
  pago: string;
}

export class LicenciaNRDto {
  @ApiProperty({ description: 'Valor de licencia no remunerada', example: '0' })
  @IsString()
  @IsNotEmpty()
  cantidad: string;

  @ApiProperty({ description: 'Fecha de inicio de la licencia no remunerada', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha de fin de la licencia no remunerada', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaFin?: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ description: 'Valor de la licencia', example: '150000' })
  @IsString()
  @IsNotEmpty()
  pago?: string;
}

export class LicenciaRDto {
  @ApiProperty({ description: 'Valor de licencia remunerada', example: '0' })
  @IsString()
  @IsNotEmpty()
  cantidad: string;

  @ApiProperty({ description: 'Fecha de inicio de la licencia remunerada', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha de fin de la licencia remunerada', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaFin?: string;

  @ApiProperty({ description: 'Valor de la licencia remunerada', example: '150000' })
  @IsString()
  @IsNotEmpty()
  pago: string;
}

export class LicenciasDto {
  @ApiProperty({ description: 'Licencia maternidad/paternidad', type: LicenciaMPDto, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LicenciaMPDto)
  licenciaMP?: LicenciaMPDto[];

  @ApiProperty({ description: 'Licencia no remunerada', type: LicenciaNRDto, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LicenciaNRDto)
  licenciaNR?: LicenciaNRDto[];

  @ApiProperty({ description: 'Licencia remunerada', type: LicenciaRDto, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LicenciaRDto)
  licenciaR?: LicenciaRDto[];

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ description: 'Valor de la licencia', example: '150000' })
  @IsString()
  @IsOptional()
  pago?: string;
}

export class OtroConceptoDto {
  @ApiProperty({ description: 'Valor de la prima de servicios', example: '180000' })
  @IsString()
  @IsOptional()
  conceptoNS?: string;

  @ApiProperty({ description: 'Valor de la prima de servicios', example: '180000' })
  @IsString()
  @IsOptional()
  conceptoS?: string;

  @ApiProperty({ description: 'Descripción del concepto', example: 'Prima de servicios' })
  @IsString()
  @IsOptional()
  descripcionConcepto?: string;
}

export class PrimaDto {
  @ApiProperty({ description: 'Cantidad de primas de servicios', example: '1' })
  @IsString()
  @IsOptional()
  cantidad?: string;

  @ApiProperty({ description: 'Valor de la prima de servicios', example: '180000' })
  @IsString()
  @IsOptional()
  pago?: string;

  @ApiProperty({ description: 'Valor de la prima no salarial (pagoNS según API The Factory HKA)', example: '180000', required: false })
  @IsString()
  @IsOptional()
  pagoNS?: string;

  @ApiProperty({ description: 'Extras de prima', required: false })
  @Allow()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];
}

export class TransporteDto {
  @ApiProperty({ description: 'Valor del auxilio de transporte', example: '140000' })
  @IsString()
  @IsOptional()
  auxilioTransporte?: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ description: 'Valor del viatico manual de alimentación', example: '140000' })
  @IsString()
  @IsOptional()
  viaticoManuAlojS?: string;

  @ApiProperty({ description: 'Valor del viatico manual de alojamiento', example: '140000' })
  @IsString()
  @IsOptional()
  viaticoManuAlojNS?: string;
}

export class VacacionesComunesDto {
  @ApiProperty({ description: 'Valor de vacaciones comunes', example: '0' })
  @IsString()
  @IsNotEmpty()
  cantidad: string;

  @ApiProperty({ description: 'Fecha de inicio de las vacaciones comunes', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha de fin de las vacaciones comunes', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaFin?: string;

  @ApiProperty({ description: 'Valor de vacaciones comunes', example: '150000' })
  @IsString()
  @IsNotEmpty()
  pago: string;
}

export class VacacionesCompensadasDto {
  @ApiProperty({ description: 'Valor de vacaciones compensadas', example: '0' })
  @IsString()
  @IsNotEmpty()
  cantidad: string;

  @ApiProperty({ description: 'Fecha de inicio de las vacaciones compensadas', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha de fin de las vacaciones compensadas', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechaFin?: string;

  @ApiProperty({ description: 'Valor de vacaciones compensadas', example: '150000' })
  @IsString()
  @IsNotEmpty()
  pago: string;
}

export class VacacionesDto {
  @ApiProperty({ description: 'Vacaciones comunes', type: [VacacionesComunesDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VacacionesComunesDto)
  vacacionesComunes?: VacacionesComunesDto[];

  @ApiProperty({ description: 'Vacaciones compensadas', type: [VacacionesCompensadasDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VacacionesCompensadasDto)
  vacacionesCompensadas?: VacacionesCompensadasDto[];
}

export class DevengadosDto {
  @ApiProperty({ description: 'Anticipos de nómina', type: [AnticiposNomDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnticiposNomDto)
  anticiposNom?: AnticiposNomDto[];

  @ApiProperty({ description: 'Auxilio', type: [AuxilioDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AuxilioDto)
  auxilios?: AuxilioDto[];

  @ApiProperty({ description: 'Apoyo Sost', example: '102' })
  @IsString()
  @IsOptional()
  apoyoSost?: string;

  @ApiProperty({ description: 'Básico', type: [BasicoDto], required: false })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BasicoDto)
  basico: BasicoDto[];

  @ApiProperty({ description: 'Bonificación', type: [BonificacionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BonificacionDto)
  bonificaciones?: BonificacionDto[];

  @ApiProperty({ description: 'Bonificación de retiro', example: '102' })
  @IsString()
  @IsOptional()
  bonifRetiro?: string;

  @ApiProperty({ description: 'Bono EPCTV', type: [BonoEPCTVDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BonoEPCTVDto)
  bonoEPCTV?: BonoEPCTVDto[];

  @ApiProperty({ description: 'Cesantía', type: CesantiaDto, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CesantiaDto)
  cesantias?: CesantiaDto[];

  @ApiProperty({ description: 'Comisión', type: ComisionDto, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComisionDto)
  comisiones?: ComisionDto[];

  @ApiProperty({ description: 'Compensación', type: CompensacionDto, required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompensacionDto)
  compensaciones?: CompensacionDto[];

  @ApiProperty({ description: 'Dotación', example: '102' })
  @IsString()
  @IsOptional()
  dotacion?: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ description: 'Hora extra', type: [HoraExtraDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoraExtraDto)
  horaExtras?: HoraExtraDto[];

  @ApiProperty({ description: 'Huelga legal', type: [HuelgaLegalDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HuelgaLegalDto)
  huelgaLegales?: HuelgaLegalDto[];

  @ApiProperty({ description: 'Indemnización', example: '102' })
  @IsString()
  @IsOptional()
  indemnizacion?: string;

  @ApiProperty({ description: 'Incapacidad', type: [IncapacidadDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IncapacidadDto)
  incapacidades?: IncapacidadDto[];

  @ApiProperty({ description: 'Licencias', type: LicenciasDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LicenciasDto)
  licencias?: LicenciasDto;

  @ApiProperty({ description: 'Otro concepto', type: [OtroConceptoDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OtroConceptoDto)
  otrosConceptos?: OtroConceptoDto[];

  @ApiProperty({ description: 'Pago a terceros', type: [PagoTerceroDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PagoTerceroDto)
  pagosTerceros?: PagoTerceroDto[];

  @ApiProperty({ description: 'Prima', type: [PrimaDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrimaDto)
  primas?: PrimaDto[];

  @ApiProperty({ description: 'Reintegro', example: '102' })
  @IsString()
  @IsOptional()
  reintegro?: string;

  @ApiProperty({ description: 'Teletrabajo', example: '102' })
  @IsString()
  @IsOptional()
  teletrabajo?: string;

  @ApiProperty({ description: 'Transporte', type: [TransporteDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransporteDto)
  transporte?: TransporteDto[];

  @ApiProperty({ description: 'Vacaciones', type: VacacionesDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => VacacionesDto)
  vacaciones?: VacacionesDto;
}

// ============================================================================
// DTOs para Documentos Referenciados
// ============================================================================

export class DocumentoReferenciadoNomDto {
  @ApiProperty({ description: 'CUNE del documento referenciado', example: 'CUNE123456789012345678901234567890123456789012345678901234567890' })
  @IsString()
  @IsNotEmpty()
  cunePred: string;

  @ApiProperty({ description: 'Número del documento referenciado', example: 'NE001' })
  @IsString()
  @IsNotEmpty()
  numeroPred: string;

  @ApiProperty({ description: 'Fecha del documento referenciado', example: '2024-01-15' })
  @IsString()
  @IsNotEmpty()
  fechaGenPred: string;
}

// ============================================================================
// DTOs para Notas
// ============================================================================

export class NotaDto {
  @ApiProperty({ description: 'Texto de la nota', example: 'Ajuste por error de cálculo en comisiones' })
  @IsString()
  @IsNotEmpty()
  texto: string;
}

// ============================================================================
// DTOs para Lugar de Generación XML
// ============================================================================

export class LugarGeneracionXMLDto {
  @ApiProperty({ description: 'Código del país', example: 'CO' })
  @IsString()
  @IsNotEmpty()
  pais: string;

  @ApiProperty({ description: 'Código del departamento', example: '11' })
  @IsString()
  @IsNotEmpty()
  departamentoEstado: string;

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @Allow()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[] | null;

  @ApiProperty({ description: 'Código del municipio', example: '11001' })
  @IsString()
  @IsNotEmpty()
  municipioCiudad: string;

  @ApiProperty({ description: 'Código del idioma', example: 'es' })
  @IsString()
  @IsNotEmpty()
  idioma: string;
}

// ============================================================================
// DTOs para Pagos
// ============================================================================

export class FechasPagosDto {
  @ApiProperty({ description: 'Extras de nómina', required: false })
  @Allow()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[] | null;

  @ApiProperty({ description: 'Fecha de pago de la nómina (fechapagonomina según API The Factory HKA)', example: '2026-01-31' })
  @IsString()
  @IsNotEmpty()
  fechapagonomina: string;
}

// ============================================================================
// DTOs para Pago
// ============================================================================

export class PagoDto {

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @Allow()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[] | null;

  @ApiProperty({ description: 'Fechas de pagos', type: [FechasPagosDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FechasPagosDto)
  @IsNotEmpty()
  fechasPagos: FechasPagosDto[];

  @ApiProperty({ description: 'Fecha de Pago de la Nómina', example: '2024-01-31' })
  @IsString()
  @IsOptional()
  fechapagonomina?: string;

  @ApiProperty({ description: 'Métodos de Pago del Documento', example: '1' })
  @IsString()
  @IsOptional()
  metodoDePago?: string;

  @ApiProperty({ description: 'Medios de Pago del Documento', example: '1' })
  @IsString()
  @IsOptional()
  medioPago?: string;

  @ApiProperty({ description: 'Nombre de la entidad bancaria donde el trabajador tiene su cuenta para pago de nómina', example: 'BANCOLOMBIA', required: false })
  @IsString()
  @IsOptional()
  nombreBanco?: string;

  @ApiProperty({ description: 'Tipo de cuenta que el trabajador tiene para pago de nómina', example: 'AHORROS', required: false })
  @IsString()
  @IsOptional()
  tipoCuenta?: string;

  @ApiProperty({ description: 'Número de la cuenta que el trabajador tiene para pago de nómina', example: '123456789', required: false })
  @IsString()
  @IsOptional()
  numeroCuenta?: string;
}

// ============================================================================
// DTOs para Periodo
// ============================================================================

export class PeriodoDto {
  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ 
    description: 'Fecha de ingreso del trabajador a la empresa, en formato AAAA-MM-DD', 
    example: '2023-01-01' 
  })
  @IsString()
  @IsNotEmpty()
  fechaIngreso: string;

  @ApiProperty({ 
    description: 'Fecha de inicio del periodo de liquidación del documento, en formato AAAA-MM-DD', 
    example: '2024-01-01' 
  })
  @IsString()
  @IsNotEmpty()
  fechaLiquidacionInicio: string;

  @ApiProperty({ 
    description: 'Fecha de fin del periodo de liquidación del documento, en formato AAAA-MM-DD', 
    example: '2024-01-31' 
  })
  @IsString()
  @IsNotEmpty()
  fechaLiquidacionFin: string;

  @ApiProperty({ 
    description: 'Fecha de retiro del trabajador a la empresa, en formato AAAA-MM-DD', 
    example: null, 
    required: false 
  })
  @IsString()
  @IsOptional()
  fechaRetiro?: string;

  @ApiProperty({ 
    description: 'Cantidad de tiempo que lleva laborando el trabajador en la empresa (5 caracteres enteros n decimales - días)', 
    example: '365.00' 
  })
  @IsString()
  @IsOptional()
  tiempoLaborado?: string;
}

// ============================================================================
// DTOs para Trabajador
// ============================================================================

export class TrabajadorDto {
  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ description: 'Tipo de identificación', example: 'CC' })
  @IsString()
  @IsNotEmpty()
  tipoIdentificacion: string;

  @ApiProperty({ description: 'Número de documento de identificación', example: '12345678' })
  @IsString()
  @IsNotEmpty()
  numeroDocumento: string;

  @ApiProperty({ description: 'Primer apellido', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  primerApellido: string;

  @ApiProperty({ description: 'Segundo apellido', example: 'Gómez' })
  @IsString()
  @IsNotEmpty()
  segundoApellido: string;

  @ApiProperty({ description: 'Primer nombre', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  primerNombre: string;

  @ApiProperty({ description: 'Otros nombres', example: 'Carlos' })
  @IsString()
  @IsOptional()
  otrosNombres?: string;

  @ApiProperty({ description: 'Código del trabajador', example: '01' })
  @IsString()
  @IsNotEmpty()
  codigoTrabajador: string;

  @ApiProperty({ description: 'Tipo de trabajador', example: '01' })
  @IsString()
  @IsNotEmpty()
  tipoTrabajador: string;

  @ApiProperty({ description: 'Sub tipo de trabajador', example: '00' })
  @IsString()
  @IsNotEmpty()
  subTipoTrabajador: string;

  @ApiProperty({ description: 'Tipo de contrato', example: '1' })
  @IsString()
  @IsNotEmpty()
  tipoContrato: string;

  @ApiProperty({ description: 'Salario integral', example: '0' })
  @IsString()
  @IsNotEmpty()
  salarioIntegral: string;

  @ApiProperty({ description: 'Alto riesgo pensión', example: '0' })
  @IsString()
  @IsNotEmpty()
  altoRiesgoPension: string;

  @ApiProperty({ description: 'Sueldo', example: '1300000' })
  @IsString()
  @IsNotEmpty()
  sueldo: string;

  @ApiProperty({ description: 'Email del trabajador', example: 'juan.perez@email.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Código del departamento de trabajo', example: '11' })
  @IsString()
  @IsNotEmpty()
  lugarTrabajoDepartamentoEstado: string;

  @ApiProperty({ description: 'Dirección del lugar de trabajo', example: 'Calle 123 # 45-67' })
  @IsString()
  @IsNotEmpty()
  lugarTrabajoDireccion: string;

  @ApiProperty({ description: 'Código del municipio de trabajo', example: '11001' })
  @IsString()
  @IsNotEmpty()
  lugarTrabajoMunicipioCiudad: string;

  @ApiProperty({ description: 'Código del país de trabajo', example: 'CO' })
  @IsString()
  @IsNotEmpty()
  lugarTrabajoPais: string;
}



// ============================================================================
// DTO Principal de Nómina Electrónica
// ============================================================================

export class NominaElectronicaDto {
  @ApiProperty({ description: 'Consecutivo del documento de nómina', example: 'NE001' })
  @IsString()
  @IsNotEmpty()
  consecutivoDocumentoNom: string;

  @ApiProperty({ description: 'Deducciones', type: DeduccionesDto })
  @ValidateNested()
  @Type(() => DeduccionesDto)
  deducciones: DeduccionesDto;

  @ApiProperty({ description: 'Devengados', type: DevengadosDto })
  @ValidateNested()
  @Type(() => DevengadosDto)
  devengados: DevengadosDto;

  @ApiProperty({ description: 'Documentos referenciados', type: [DocumentoReferenciadoNomDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentoReferenciadoNomDto)
  documentosReferenciadosNom?: DocumentoReferenciadoNomDto[];

  @ApiProperty({ description: 'Extras de nómina', required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  extrasNom?: any[];

  @ApiProperty({ description: 'Fecha de emisión de la nómina', example: '2024-01-31 10:30:00' })
  @IsString()
  @IsNotEmpty()
  fechaEmisionNom: string;

  @ApiProperty({ description: 'Notas', type: [NotaDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotaDto)
  notas?: NotaDto[];

  @ApiProperty({ description: 'Indica si existe novedad contractual', example: '0' })
  @IsString()
  @IsNotEmpty()
  novedad: string;

  @ApiProperty({ description: 'CUNE de la novedad', example: null, required: false })
  @Allow()
  @IsOptional()
  @IsString()
  novedadCUNE?: string | null;

  @ApiProperty({ description: 'Lugar de generación del XML', type: LugarGeneracionXMLDto })
  @ValidateNested()
  @Type(() => LugarGeneracionXMLDto)
  lugarGeneracionXML: LugarGeneracionXMLDto;

  @ApiProperty({ description: 'Pagos', type: [PagoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PagoDto)
  pagos: PagoDto[];

  @ApiProperty({ description: 'Periodo de nómina', example: '1' })
  @IsString()
  @IsNotEmpty()
  periodoNomina: string;

  @ApiProperty({ description: 'Periodos', type: [PeriodoDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PeriodoDto)
  periodos: PeriodoDto[];

  @ApiProperty({ description: 'Rango de numeración de la nómina', example: 'NE-001' })
  @IsString()
  @IsNotEmpty()
  rangoNumeracionNom: string;

  @ApiProperty({ description: 'Redondeo', example: '0', required: false })
  @IsString()
  @IsOptional()
  redondeo?: string;

  @ApiProperty({ description: 'Tipo de documento de nómina', example: '102' })
  @IsString()
  @IsNotEmpty()
  tipoDocumentoNom: string;

  @ApiProperty({ description: 'Tipo de moneda de nómina', example: 'COP' })
  @IsString()
  @IsNotEmpty()
  tipoMonedaNom: string;

  @ApiProperty({ description: 'Tipo de nota', example: '102', nullable: true })
  @Allow()
  @IsOptional()
  @IsString()
  tipoNota?: string | null;

  @ApiProperty({ description: 'Total del comprobante', example: '102' })
  @IsString()
  @IsNotEmpty()
  totalComprobante: string;

  @ApiProperty({ description: 'Total de deducciones', example: '102' })
  @IsString()
  @IsNotEmpty()
  totalDeducciones: string;

  @ApiProperty({ description: 'Total de devengados', example: '102' })
  @IsString()
  @IsNotEmpty()
  totalDevengados: string;

  @ApiProperty({ description: 'Tipo de documento de nómina', example: '102' })
  @IsString()
  @IsOptional()
  trm?: string;

  @ApiProperty({ description: 'Trabajador', type: TrabajadorDto })
  @ValidateNested()
  @Type(() => TrabajadorDto)
  trabajador: TrabajadorDto;


}

// ============================================================================
// DTO Principal para el método Enviar
// ============================================================================

export class EnviarPayrollRequestDto {
  @ApiProperty({ description: 'ID del software (NIT del empleador emisor)', example: '900123456' })
  @IsString()
  @IsNotEmpty()
  idSoftware: string;

  @ApiProperty({ description: 'Token de la empresa', example: 'token_empresa_demo' })
  @IsString()
  @IsNotEmpty()
  tokenEnterprise: string;

  @ApiProperty({ description: 'Contraseña del token', example: 'password_token' })
  @IsString()
  @IsNotEmpty()
  tokenPassword: string;

  @ApiProperty({ description: 'NIT del empleador', example: '900123456' })
  @IsString()
  @IsNotEmpty()
  nitEmpleador: string;

  @ApiProperty({ description: 'Objeto de nómina electrónica', type: NominaElectronicaDto })
  @ValidateNested()
  @Type(() => NominaElectronicaDto)
  objNomina: NominaElectronicaDto;
}

// ============================================================================
// DTO de Respuesta para el método Enviar
// ============================================================================

export class EnviarPayrollResponseDto {
  @ApiProperty({ description: 'Indica el Estado de la operación retornado por el servicio (integer en API The Factory HKA)', example: 200 })
  @Allow()
  codigo?: number | string;

  @ApiProperty({ description: 'Este mensaje está asociado al código de respuesta', example: 'Nómina procesada exitosamente', nullable: true })
  @IsOptional()
  @IsString()
  mensaje?: string | null;

  @ApiProperty({ description: 'Resultado del consumo del método: "Procesado" ó "Error"', example: 'Procesado', nullable: true })
  @IsOptional()
  @IsString()
  resultado?: string | null;

  @ApiProperty({ description: 'Prefijo y Consecutivo del Documento concatenado sin separadores', example: 'PRUE980338337', nullable: true })
  @IsOptional()
  @IsString()
  consecutivoDocumento?: string | null;

  @ApiProperty({ description: 'Código Único de Nómina Electrónica correspondiente al documento consultado', example: 'a1b2c3d4-e5f6-g7h8-i9j0', nullable: true })
  @IsOptional()
  @IsString()
  cune?: string | null;

  @ApiProperty({ description: 'Número de seguimiento (trackId en API The Factory HKA)', example: '123e4567-e89b-12d3-a456-426614174000', nullable: true })
  @IsOptional()
  @IsString()
  trackId?: string | null;

  @ApiProperty({ description: 'Reglas de validación en caso de notificación TFHKA', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reglasNotificacionesTFHKA?: string[] | null;

  @ApiProperty({ description: 'Reglas de validación en caso de notificación DIAN', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reglasNotificacionesDIAN?: string[] | null;

  @ApiProperty({ description: 'Reglas de validación en caso de rechazo TFHKA', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reglasRechazoTFHKA?: string[] | null;

  @ApiProperty({ description: 'Reglas de validación en caso de rechazo DIAN', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  reglasRechazoDIAN?: string[] | null;

  @ApiProperty({ description: 'Indica el nit del empleador', example: '900123456', required: false })
  @IsOptional()
  @IsString()
  nitEmpleador?: string | null;

  @ApiProperty({ description: 'Indica el nit del empleado', example: '12345678', required: false })
  @IsOptional()
  @IsString()
  nitEmpleado?: string | null;

  @ApiProperty({ description: 'Identificador de Casa de Software', example: 'SOFTWARE001', required: false })
  @IsOptional()
  @IsString()
  idSoftware?: string | null;

  @ApiProperty({ description: 'Concatenación cadena del código QR (elemento de control)', required: false })
  @IsOptional()
  @IsString()
  qr?: string | null;

  @ApiProperty({ description: '"true" Si es válido según DIAN', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  esvalidoDIAN?: boolean;

  @ApiProperty({ description: 'XML de la nómina', required: false })
  @IsOptional()
  @IsString()
  xml?: string | null;
} 