import { IsString, IsNotEmpty, IsNumber, IsObject, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ClienteDestinatarioDto {
  @IsString()
  @IsNotEmpty()
  canalDeEntrega: string;

  @IsString({ each: true })
  @IsNotEmpty()
  email: string[];

  @IsString()
  @IsNotEmpty()
  fechaProgramada: string;

  @IsString()
  @IsNotEmpty()
  mensajePersonalizado: string;

  @IsString()
  @IsNotEmpty()
  nitProveedorReceptor: string;

  @IsString()
  @IsOptional()
  telefono?: string;
}

export class ClienteDto {
  @IsString()
  @IsOptional()
  actividadEconomicaCIIU?: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ValidateNested()
  @Type(() => ClienteDestinatarioDto)
  destinatario: ClienteDestinatarioDto;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombreRazonSocial: string;

  @IsString()
  @IsNotEmpty()
  numeroDocumento: string;

  @IsString()
  @IsNotEmpty()
  tipoIdentificacion: string;
}

export class FacturaDetalleDto {
  @IsNumber()
  cantidadReal: number;

  @IsString()
  codigoProducto: string;

  @IsString()
  descripcion: string;

  @IsNumber()
  precioTotal: number;

  @IsNumber()
  precioTotalSinImpuestos: number;

  @IsNumber()
  precioVentaUnitario: number;

  @IsString()
  unidadMedida: string;
}

export class FacturaDto {
  @IsNumber()
  cantidadDecimales: number;

  @ValidateNested()
  @Type(() => ClienteDto)
  cliente: ClienteDto;

  @IsString()
  @IsNotEmpty()
  consecutivoDocumento: string;

  @ValidateNested({ each: true })
  @Type(() => FacturaDetalleDto)
  detalleDeFactura: FacturaDetalleDto[];

  @IsString()
  @IsNotEmpty()
  fechaEmision: string;

  @IsString()
  @IsNotEmpty()
  fechaVencimiento: string;

  @IsString()
  @IsNotEmpty()
  moneda: string;

  @IsString()
  @IsNotEmpty()
  tipoDocumento: string;

  @IsNumber()
  totalSinImpuestos: number;

  @IsNumber()
  totalBrutoConImpuesto: number;
}

export class EnviarRequestDto {
  @IsString()
  @IsNotEmpty()
  tokenEmpresa: string;

  @IsString()
  @IsNotEmpty()
  tokenPassword: string;

  @ValidateNested()
  @Type(() => FacturaDto)
  factura: FacturaDto;

  @IsString()
  @IsNotEmpty()
  adjuntos: string;
} 