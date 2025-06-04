import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsNumber, 
  IsBoolean, 
  IsArray, 
  ValidateNested, 
  IsEmail,
  Min,
  Max,
  IsDateString
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// DTO base para campos comunes de usuario
export class UserBaseDto {
  @ApiProperty({ description: 'Número de identificación', required: false })
  @IsOptional()
  @IsString()
  identification_number?: string;

  @ApiProperty({ description: 'Dígito de verificación', required: false })
  @IsOptional()
  @IsNumber()
  dv?: number;

  @ApiProperty({ description: 'Tipo de documento de identificación', required: false })
  @IsOptional()
  @IsNumber()
  type_document_identification_id?: number;

  @ApiProperty({ description: 'Tipo de organización', required: false })
  @IsOptional()
  @IsNumber()
  type_organization_id?: number;

  @ApiProperty({ description: 'ID de idioma', required: false })
  @IsOptional()
  @IsNumber()
  language_id?: number;

  @ApiProperty({ description: 'ID de país', required: false })
  @IsOptional()
  @IsNumber()
  country_id?: number;

  @ApiProperty({ description: 'ID de municipio', required: false })
  @IsOptional()
  @IsNumber()
  municipality_id?: number;

  @ApiProperty({ description: 'Nombre', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Teléfono', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Dirección', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Email', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CustomerDto extends UserBaseDto {
  @ApiProperty({ description: 'Número de identificación del cliente' })
  @IsString()
  @IsNotEmpty()
  identification_number: string;

  @ApiProperty({ description: 'Nombre completo del cliente - requerido por Laravel' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Primer nombre del cliente', required: false })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ description: 'Primer apellido del cliente', required: false })
  @IsOptional()
  @IsString()
  family_first_surname?: string;

  @ApiProperty({ description: 'Razón social del cliente', required: false })
  @IsOptional()
  @IsString()
  business_name?: string;

  @ApiProperty({ description: 'Código de municipio facturador', required: false })
  @IsOptional()
  @IsString()
  municipality_id_fact?: string;

  @ApiProperty({ description: 'Tipo de régimen', required: false })
  @IsOptional()
  @IsNumber()
  type_regime_id?: number;

  @ApiProperty({ description: 'ID de impuesto', required: false })
  @IsOptional()
  @IsNumber()
  tax_id?: number;

  @ApiProperty({ description: 'Tipo de responsabilidad', required: false })
  @IsOptional()
  @IsNumber()
  type_liability_id?: number;

  @ApiProperty({ description: 'Registro mercantil', required: false })
  @IsOptional()
  @IsString()
  merchant_registration?: string;
}

export class DeliveryDto {
  @ApiProperty({ description: 'ID de idioma', required: false })
  @IsOptional()
  @IsNumber()
  language_id?: number;

  @ApiProperty({ description: 'ID de país', required: false })
  @IsOptional()
  @IsNumber()
  country_id?: number;

  @ApiProperty({ description: 'ID de municipio', required: false })
  @IsOptional()
  @IsNumber()
  municipality_id?: number;

  @ApiProperty({ description: 'Dirección de entrega' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Fecha real de entrega (YYYY-MM-DD)' })
  @IsDateString()
  actual_delivery_date: string;
}

export class DeliveryPartyDto extends UserBaseDto {
  @ApiProperty({ description: 'Número de identificación' })
  @IsString()
  @IsNotEmpty()
  identification_number: string;

  @ApiProperty({ description: 'Tipo de régimen', required: false })
  @IsOptional()
  @IsNumber()
  type_regime_id?: number;

  @ApiProperty({ description: 'ID de impuesto', required: false })
  @IsOptional()
  @IsNumber()
  tax_id?: number;

  @ApiProperty({ description: 'Tipo de responsabilidad', required: false })
  @IsOptional()
  @IsNumber()
  type_liability_id?: number;

  @ApiProperty({ description: 'Registro mercantil', required: false })
  @IsOptional()
  @IsString()
  merchant_registration?: string;
}

export class PaymentFormDto {
  @ApiProperty({ description: 'ID de forma de pago', required: false })
  @IsOptional()
  @IsNumber()
  payment_form_id?: number;

  @ApiProperty({ description: 'ID de método de pago', required: false })
  @IsOptional()
  @IsNumber()
  payment_method_id?: number;

  @ApiProperty({ description: 'Fecha de vencimiento (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  payment_due_date?: string;

  @ApiProperty({ description: 'Duración en días', required: false })
  @IsOptional()
  @IsNumber()
  duration_measure?: number;
}

export class AllowanceChargeDto {
  @ApiProperty({ description: 'Indicador de cargo (true) o descuento (false)', required: false })
  @IsOptional()
  @IsBoolean()
  charge_indicator?: boolean;

  @ApiProperty({ description: 'ID de descuento', required: false })
  @IsOptional()
  @IsNumber()
  discount_id?: number;

  @ApiProperty({ description: 'Razón del cargo/descuento', required: false })
  @IsOptional()
  @IsString()
  allowance_charge_reason?: string;

  @ApiProperty({ description: 'Monto', required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: 'Monto base', required: false })
  @IsOptional()
  @IsNumber()
  base_amount?: number;

  @ApiProperty({ description: 'Factor multiplicador', required: false })
  @IsOptional()
  @IsNumber()
  multiplier_factor_numeric?: number;
}

export class TaxTotalDto {
  @ApiProperty({ description: 'ID de impuesto', required: false })
  @IsOptional()
  @IsNumber()
  tax_id?: number;

  @ApiProperty({ description: 'Nombre del impuesto', required: false })
  @IsOptional()
  @IsString()
  tax_name?: string;

  @ApiProperty({ description: 'Porcentaje de impuesto', required: false })
  @IsOptional()
  @IsNumber()
  percent?: number;

  @ApiProperty({ description: 'Monto del impuesto', required: false })
  @IsOptional()
  @IsNumber()
  tax_amount?: number;

  @ApiProperty({ description: 'Base gravable', required: false })
  @IsOptional()
  @IsNumber()
  taxable_amount?: number;

  @ApiProperty({ description: 'ID de unidad de medida', required: false })
  @IsOptional()
  @IsNumber()
  unit_measure_id?: number;

  @ApiProperty({ description: 'Monto por unidad', required: false })
  @IsOptional()
  @IsNumber()
  per_unit_amount?: number;

  @ApiProperty({ description: 'Unidad base de medida', required: false })
  @IsOptional()
  @IsNumber()
  base_unit_measure?: number;
}

export class PrepaidPaymentDto {
  @ApiProperty({ description: 'ID de pago', required: false })
  @IsOptional()
  @IsString()
  idpayment?: string;

  @ApiProperty({ description: 'Tipo de pago prepago', required: false })
  @IsOptional()
  @IsNumber()
  prepaid_payment_type_id?: number;

  @ApiProperty({ description: 'Monto pagado', required: false })
  @IsOptional()
  @IsNumber()
  paidamount?: number;

  @ApiProperty({ description: 'Fecha recibida (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  receiveddate?: string;

  @ApiProperty({ description: 'Fecha pagada (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  paiddate?: string;

  @ApiProperty({ description: 'ID de instrucción', required: false })
  @IsOptional()
  @IsString()
  instructionid?: string;
}

export class LegalMonetaryTotalDto {
  @ApiProperty({ description: 'Subtotal sin impuestos' })
  @IsNumber()
  @Min(0)
  line_extension_amount: number;

  @ApiProperty({ description: 'Total sin impuestos' })
  @IsNumber()
  @Min(0)
  tax_exclusive_amount: number;

  @ApiProperty({ description: 'Total con impuestos' })
  @IsNumber()
  @Min(0)
  tax_inclusive_amount: number;

  @ApiProperty({ description: 'Total descuentos', required: false })
  @IsOptional()
  @IsNumber()
  allowance_total_amount?: number;

  @ApiProperty({ description: 'Total cargos', required: false })
  @IsOptional()
  @IsNumber()
  charge_total_amount?: number;

  @ApiProperty({ description: 'Total prepagado', required: false })
  @IsOptional()
  @IsNumber()
  pre_paid_amount?: number;

  @ApiProperty({ description: 'Total a pagar' })
  @IsNumber()
  @Min(0)
  payable_amount: number;
}

export class InvoiceLineDto {
  @ApiProperty({ description: 'ID de unidad de medida' })
  @IsNumber()
  unit_measure_id: number;

  @ApiProperty({ description: 'Cantidad facturada' })
  @IsNumber()
  @Min(0)
  invoiced_quantity: number;

  @ApiProperty({ description: 'Valor de la línea' })
  @IsNumber()
  @Min(0)
  line_extension_amount: number;

  @ApiProperty({ description: 'Indicador de gratuidad' })
  @IsBoolean()
  free_of_charge_indicator: boolean;

  @ApiProperty({ description: 'ID de precio de referencia', required: false })
  @IsOptional()
  @IsNumber()
  reference_price_id?: number;

  @ApiProperty({ description: 'Cargos/descuentos de línea', type: [AllowanceChargeDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowanceChargeDto)
  allowance_charges?: AllowanceChargeDto[];

  @ApiProperty({ description: 'Impuestos de línea', type: [TaxTotalDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxTotalDto)
  tax_totals?: TaxTotalDto[];

  @ApiProperty({ description: 'Descripción del producto/servicio' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Notas de línea', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Código del producto' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ description: 'Tipo de identificación del ítem' })
  @IsNumber()
  type_item_identification_id: number;

  @ApiProperty({ description: 'Precio unitario' })
  @IsNumber()
  @Min(0)
  price_amount: number;

  @ApiProperty({ description: 'Cantidad base' })
  @IsNumber()
  @Min(0)
  base_quantity: number;
}

export class OrderReferenceDto {
  @ApiProperty({ description: 'ID de orden', required: false })
  @IsOptional()
  @IsString()
  id_order?: string;

  @ApiProperty({ description: 'Fecha de emisión de orden (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  issue_date_order?: string;
}

export class AdditionalDocumentReferenceDto {
  @ApiProperty({ description: 'ID de documento', required: false })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({ description: 'Fecha de documento (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Tipo de documento', required: false })
  @IsOptional()
  @IsNumber()
  type_document_id?: number;
}

export class SmtpParametersDto {
  @ApiProperty({ description: 'Host SMTP' })
  @IsString()
  @IsNotEmpty()
  host: string;

  @ApiProperty({ description: 'Puerto SMTP' })
  @IsString()
  @IsNotEmpty()
  port: string;

  @ApiProperty({ description: 'Usuario SMTP' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Contraseña SMTP' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Encriptación SMTP' })
  @IsString()
  @IsNotEmpty()
  encryption: string;

  @ApiProperty({ description: 'Dirección de origen', required: false })
  @IsOptional()
  @IsString()
  from_address?: string;

  @ApiProperty({ description: 'Nombre de origen', required: false })
  @IsOptional()
  @IsString()
  from_name?: string;
}

export class EmailCcDto {
  @ApiProperty({ description: 'Email para copia' })
  @IsEmail()
  email: string;
}

export class AnnexDto {
  @ApiProperty({ description: 'Documento en base64' })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({ description: 'Extensión del archivo' })
  @IsString()
  @IsNotEmpty()
  extension: string;
}

export class DynamicFieldDto {
  @ApiProperty({ description: 'Nombre del campo' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Valor del campo' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ description: 'Agregar al total', required: false })
  @IsOptional()
  @IsBoolean()
  add_to_total?: boolean;
}

export class CreateInvoiceDto {
  // Token específico para NestJS (no va a Laravel)
  @ApiProperty({ description: 'Token de autenticación' })
  @IsString()
  @IsNotEmpty()
  token: string;

  // Campos adicionales del facturador
  @ApiProperty({ description: 'IVA responsable', required: false })
  @IsOptional()
  @IsString()
  ivaresponsable?: string;

  @ApiProperty({ description: 'Nombre tipo documento ID', required: false })
  @IsOptional()
  @IsString()
  nombretipodocid?: string;

  @ApiProperty({ description: 'Tarifa ICA', required: false })
  @IsOptional()
  @IsString()
  tarifaica?: string;

  @ApiProperty({ description: 'Actividad económica', required: false })
  @IsOptional()
  @IsString()
  actividadeconomica?: string;

  @ApiProperty({ description: 'Email POS cliente', required: false })
  @IsOptional()
  @IsEmail()
  email_pos_customer?: string;

  // Datos del establecimiento
  @ApiProperty({ description: 'Nombre del establecimiento', required: false })
  @IsOptional()
  @IsString()
  establishment_name?: string;

  @ApiProperty({ description: 'Dirección del establecimiento', required: false })
  @IsOptional()
  @IsString()
  establishment_address?: string;

  @ApiProperty({ description: 'Teléfono del establecimiento', required: false })
  @IsOptional()
  @IsString()
  establishment_phone?: string;

  @ApiProperty({ description: 'Municipio del establecimiento', required: false })
  @IsOptional()
  @IsNumber()
  establishment_municipality?: number;

  @ApiProperty({ description: 'Email del establecimiento', required: false })
  @IsOptional()
  @IsEmail()
  establishment_email?: string;

  @ApiProperty({ description: 'Logo del establecimiento', required: false })
  @IsOptional()
  @IsString()
  establishment_logo?: string;

  // Lista de correos copia
  @ApiProperty({ description: 'Lista de correos en copia', type: [EmailCcDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailCcDto)
  email_cc_list?: EmailCcDto[];

  // Anexos
  @ApiProperty({ description: 'Documentos anexos', type: [AnnexDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnnexDto)
  annexes?: AnnexDto[];

  // HTML del email
  @ApiProperty({ description: 'Header HTML del email', required: false })
  @IsOptional()
  @IsString()
  html_header?: string;

  @ApiProperty({ description: 'Body HTML del email', required: false })
  @IsOptional()
  @IsString()
  html_body?: string;

  @ApiProperty({ description: 'Botones HTML del email', required: false })
  @IsOptional()
  @IsString()
  html_buttons?: string;

  @ApiProperty({ description: 'Footer HTML del email', required: false })
  @IsOptional()
  @IsString()
  html_footer?: string;

  // Template
  @ApiProperty({ description: 'Nombre del template de factura', required: false })
  @IsOptional()
  @IsString()
  invoice_template?: string;

  @ApiProperty({ description: 'Token del template', required: false })
  @IsOptional()
  @IsString()
  template_token?: string;

  // Consultas
  @ApiProperty({ description: 'Solo consultar UUID', required: false })
  @IsOptional()
  @IsBoolean()
  query_uuid?: boolean;

  @ApiProperty({ description: 'No enviar aún a DIAN', required: false })
  @IsOptional()
  @IsBoolean()
  dont_send_yet?: boolean;

  // Campo dinámico
  @ApiProperty({ description: 'Campo dinámico', type: DynamicFieldDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DynamicFieldDto)
  dynamic_field?: DynamicFieldDto;

  // Otros campos
  @ApiProperty({ description: 'Asistente de ventas', required: false })
  @IsOptional()
  @IsString()
  sales_assistant?: string;

  @ApiProperty({ description: 'Sitio web', required: false })
  @IsOptional()
  @IsString()
  web_site?: string;

  @ApiProperty({ description: 'Prefijo nombre documento adjunto', required: false })
  @IsOptional()
  @IsString()
  atacheddocument_name_prefix?: string;

  @ApiProperty({ description: 'Régimen SEZE', required: false })
  @IsOptional()
  @IsString()
  seze?: string;

  @ApiProperty({ description: 'Nota pie de página', required: false })
  @IsOptional()
  @IsString()
  foot_note?: string;

  @ApiProperty({ description: 'Nota encabezado', required: false })
  @IsOptional()
  @IsString()
  head_note?: string;

  @ApiProperty({ description: 'Desactivar texto confirmación', required: false })
  @IsOptional()
  @IsBoolean()
  disable_confirmation_text?: boolean;

  // Envío de correos
  @ApiProperty({ description: 'Enviar correo al cliente', required: false })
  @IsOptional()
  @IsBoolean()
  sendmail?: boolean;

  @ApiProperty({ description: 'Enviar correo a mí mismo', required: false })
  @IsOptional()
  @IsBoolean()
  sendmailtome?: boolean;

  @ApiProperty({ description: 'Enviar credenciales al cliente', required: false })
  @IsOptional()
  @IsBoolean()
  send_customer_credentials?: boolean;

  @ApiProperty({ description: 'Guardar en', required: false })
  @IsOptional()
  @IsString()
  GuardarEn?: string;

  // Documento
  @ApiProperty({ description: 'Tipo de documento (1 = Factura)' })
  @IsNumber()
  type_document_id: number;

  @ApiProperty({ description: 'Número de resolución', required: false })
  @IsOptional()
  @IsString()
  resolution_number?: string;

  @ApiProperty({ description: 'Prefijo de la factura', required: false })
  @IsOptional()
  @IsString()
  prefix?: string;

  @ApiProperty({ description: 'Número consecutivo de la factura' })
  @IsNumber()
  @Min(1)
  number: number;

  @ApiProperty({ description: 'Fecha de emisión (YYYY-MM-DD)', required: false })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiProperty({ description: 'Hora de emisión (HH:mm:ss)', required: false })
  @IsOptional()
  @IsString()
  time?: string;

  @ApiProperty({ description: 'Notas adicionales', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Elaborado por', required: false })
  @IsOptional()
  @IsString()
  elaborated?: string;

  @ApiProperty({ description: 'Revisado por', required: false })
  @IsOptional()
  @IsString()
  reviewed?: string;

  @ApiProperty({ description: 'Tipo de operación', required: false })
  @IsOptional()
  @IsNumber()
  type_operation_id?: number;

  // Cliente (requerido)
  @ApiProperty({ description: 'Datos del cliente', type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  // Parámetros SMTP
  @ApiProperty({ description: 'Parámetros del servidor SMTP', type: SmtpParametersDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => SmtpParametersDto)
  smtp_parameters?: SmtpParametersDto;

  // Referencias
  @ApiProperty({ description: 'Referencia de orden', type: OrderReferenceDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderReferenceDto)
  order_reference?: OrderReferenceDto;

  @ApiProperty({ description: 'Referencia documento adicional', type: AdditionalDocumentReferenceDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdditionalDocumentReferenceDto)
  additional_document_reference?: AdditionalDocumentReferenceDto;

  // Entrega
  @ApiProperty({ description: 'Datos de entrega', type: DeliveryDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryDto)
  delivery?: DeliveryDto;

  @ApiProperty({ description: 'Parte que entrega', type: DeliveryPartyDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeliveryPartyDto)
  deliveryparty?: DeliveryPartyDto;

  // Formas de pago
  @ApiProperty({ description: 'Formas de pago', type: [PaymentFormDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentFormDto)
  payment_form?: PaymentFormDto[];

  // Cargos y descuentos
  @ApiProperty({ description: 'Cargos y descuentos', type: [AllowanceChargeDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowanceChargeDto)
  allowance_charges?: AllowanceChargeDto[];

  // Impuestos
  @ApiProperty({ description: 'Totales de impuestos', type: [TaxTotalDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxTotalDto)
  tax_totals?: TaxTotalDto[];

  @ApiProperty({ description: 'Retenciones', type: [TaxTotalDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxTotalDto)
  with_holding_tax_total?: TaxTotalDto[];

  // Pagos prepagados
  @ApiProperty({ description: 'Pago prepagado', type: PrepaidPaymentDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PrepaidPaymentDto)
  prepaid_payment?: PrepaidPaymentDto;

  @ApiProperty({ description: 'Pagos prepagados', type: [PrepaidPaymentDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrepaidPaymentDto)
  prepaid_payments?: PrepaidPaymentDto[];

  @ApiProperty({ description: 'Saldo anterior', required: false })
  @IsOptional()
  @IsNumber()
  previous_balance?: number;

  // Totales monetarios (requerido)
  @ApiProperty({ description: 'Totales monetarios', type: LegalMonetaryTotalDto })
  @ValidateNested()
  @Type(() => LegalMonetaryTotalDto)
  legal_monetary_totals: LegalMonetaryTotalDto;

  // Líneas de factura (requerido)
  @ApiProperty({ description: 'Líneas de la factura', type: [InvoiceLineDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  invoice_lines: InvoiceLineDto[];

  @ApiProperty({ description: 'Tipo de documento de referencia adicional', required: false })
  @IsOptional()
  @IsString()
  additional_document_reference_type_document?: string;

  @ApiProperty({ description: 'ID de referencia adicional', required: false })
  @IsOptional()
  @IsString()
  additional_document_reference_id?: string;

  @ApiProperty({ description: 'Fecha de referencia adicional', required: false })
  @IsOptional()
  @IsDateString()
  additional_document_reference_date?: string;
}

export class InvoiceResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: any;
} 