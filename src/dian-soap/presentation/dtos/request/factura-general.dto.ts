export interface FacturaGeneralDto {
  cantidadDecimales: number;
  cliente: ClienteDto;
  consecutivoDocumento: string;
  detalleDeFactura: DetalleDeFacturaDto;
  fechaEmision: string;
  fechaVencimiento: string;
  impuestosGenerales: ImpuestosGeneralesDto;
  impuestosTotales: ImpuestosTotalesDto;
  mediosDePago: MediosDePagoDto;
  moneda: string;
  propina: string;
  rangoNumeracion: string;
  redondeoAplicado: string;
  tipoDocumento: string;
  tipoOperacion: string;
  totalAnticipos: string;
  totalBaseImponible: string;
  totalBrutoConImpuesto: string;
  totalCargosAplicados: string;
  totalDescuentos: string;
  totalMonto: string;
  totalProductos: string;
  totalSinImpuestos: number;
}

export interface ClienteDto {
  actividadEconomicaCIIU: string | null;
  apellido: string;
  destinatario: DestinatarioWrapper;
  detallesTributarios: DetallesTributariosDto;
  direccionCliente: DireccionDto;
  direccionFiscal: DireccionDto;
  email: string;
  informacionLegalCliente: InformacionLegalCliente;
  nombreComercial: string;
  nombreContacto: string | null;
  nombreRazonSocial: string;
  nota: string | null;
  notificar: string;
  numeroDocumento: string;
  numeroIdentificacionDV: string;
  responsabilidadesRut: ResponsabilidadesRut;
  segundoNombre: string;
  telefax: string | null;
  telefono: string | null;
  tipoIdentificacion: string;
  tipoPersona: string;
}

export interface DestinatarioWrapper {
  Destinatario: DestinatarioDto;
}

export interface DestinatarioDto {
  canalDeEntrega: string;
  email: { string: string };
  fechaProgramada: string;
  mensajePersonalizado: string;
  nitProveedorReceptor: string;
  telefono: string | null;
}

export interface DetallesTributariosDto {
  Tributos: {
    codigoImpuesto: string;
  };
}

export interface DireccionDto {
  aCuidadoDe: string | null;
  aLaAtencionDe: string | null;
  bloque: string | null;
  buzon: string | null;
  calle: string | null;
  calleAdicional: string | null;
  ciudad: string;
  codigoDepartamento: string;
  correccionHusoHorario: string | null;
  departamento: string;
  departamentoOrg: string | null;
  direccion: string;
  distrito: string | null;
  habitacion: string | null;
  lenguaje: string;
  localizacion: { Coordenadas: CoordenadasDto };
  municipio: string;
  nombreEdificio: string | null;
  numeroEdificio: string | null;
  numeroParcela: string | null;
  pais: string;
  piso: string | null;
  region: string | null;
  subDivision: string | null;
  ubicacion: string | null;
  zonaPostal: string;
}

export interface CoordenadasDto {
  gradosLatitud: string | null;
  gradosLongitud: string | null;
  minutosLatitud: string | null;
  minutosLongitud: string | null;
  orientacionLatitud: string | null;
  orientacionLongitud: string | null;
}

export interface InformacionLegalCliente {
  codigoEstablecimiento: string;
  nombreRegistroRUT: string;
  numeroIdentificacion: string;
  numeroIdentificacionDV: string;
  numeroMatriculaMercantil: string;
  prefijoFacturacion: string;
  tipoIdentificacion: string;
}

export interface ResponsabilidadesRut {
  Obligaciones: {
    obligaciones: string;
    regimen: string;
  };
}

export interface DetalleDeFacturaDto     {
  FacturaDetalle: FacturaDetalleDto | FacturaDetalleDto[];
}

export interface FacturaDetalleDto {
  cantidadPorEmpaque: string;
  cantidadReal: string;
  cantidadRealUnidadMedida: string;
  cantidadUnidades: string;
  cargosDescuentos: CargosDescuentosDto;
  codigoFabricante: string | null;
  codigoIdentificadorPais: string | null;
  codigoProducto: string;
  codigoTipoPrecio: string | null;
  descripcion: string;
  descripcion2: string | null;
  descripcion3: string | null;
  descripcionTecnica: string | null;
  documentosReferenciados: string | null;
  estandarCodigo: string;
  estandarCodigoID: string | null;
  estandarCodigoIdentificador: string | null;
  estandarCodigoProducto: string;
  estandarOrganizacion: string | null;
  estandarSubCodigoProducto: string | null;
  idEsquema: string | null;
  impuestosDetalles: ImpuestosGeneralesDto;
  impuestosTotales: { ImpuestosTotales: ImpuestosTotalesDto };
  informacionAdicional: string | null;
  mandatorioNumeroIdentificacion: string | null;
  mandatorioNumeroIdentificacionDV: string | null;
  mandatorioTipoIdentificacion: string | null;
  marca: string | null;
  modelo: string | null;
  muestraGratis: string;
  nombreFabricante: string | null;
  nota: string | null;
  precioReferencia: string | null;
  precioTotal: string;
  precioTotalSinImpuestos: string;
  precioVentaUnitario: string;
  secuencia: string;
  seriales: string | null;
  subCodigoFabricante: string | null;
  subCodigoProducto: string | null;
  tipoAIU: string | null;
  unidadMedida: string;
}

export interface CargosDescuentosDto {
  CargosDescuentos?: CargosDescuentoDto | CargosDescuentoDto[]
}

export interface CargosDescuentoDto {
  codigo: string;
  descripcion: string;
  indicador: string;
  monto: string;
  montoBase: string;
  porcentaje: string;
  secuencia: string;
}

export interface FacturaImpuestosDto {
  baseImponibleTOTALImp: string;
  codigoTOTALImp: string;
  controlInterno: string | null;
  porcentajeTOTALImp: string;
  unidadMedida: string;
  unidadMedidaTributo: string | null;
  valorTOTALImp: string;
  valorTributoUnidad: string | null;
}

export interface ImpuestosTotalesDto {
  ImpuestosTotales: ImpuestosTotales | ImpuestosTotales[]
}

export interface ImpuestosTotales {
    codigoTOTALImp: string;
    montoTotal: string;
    redondeoAplicado: string;
}

export interface ImpuestosGeneralesDto {
  FacturaImpuestos: FacturaImpuestosDto | FacturaImpuestosDto[];
}

export interface MediosDePagoDto {
  MediosDePago: MedioDePagoDto | MedioDePagoDto[];
}

export interface MedioDePagoDto {
  codigoBanco: string | null;
  codigoCanalPago: string | null;
  codigoReferencia: string | null;
  fechaDeVencimiento: string;
  medioPago: string;
  metodoDePago: string;
  nombreBanco: string | null;
  numeroDeReferencia: string | null;
  numeroDias: string;
  numeroTransferencia: string | null;
}