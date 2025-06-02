import { IsString, IsBoolean, IsArray, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerDto {
  @ApiProperty({
    description: 'Número de identificación del cliente',
    example: '12345678901',
  })
  @IsString()
  @IsNotEmpty()
  identification_number: string;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan Pérez',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del cliente',
    example: 'juan.perez@email.com',
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Teléfono del cliente',
    example: '+57 300 123 4567',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Dirección del cliente',
    example: 'Calle 123 #45-67',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;
}

export class PaymentFormDto {
  @ApiProperty({
    description: 'ID de la forma de pago',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  payment_form_id: string;

  @ApiProperty({
    description: 'Código del método de pago',
    example: '10',
    required: false,
  })
  @IsString()
  @IsOptional()
  payment_method_code?: string;

  @ApiProperty({
    description: 'Fecha de vencimiento del pago',
    example: '2024-02-15',
    required: false,
  })
  @IsString()
  @IsOptional()
  payment_due_date?: string;
}

export class LegalMonetaryTotalsDto {
  @ApiProperty({
    description: 'Monto de extensión de línea',
    example: '100000.00',
  })
  @IsString()
  @IsNotEmpty()
  line_extension_amount: string;

  @ApiProperty({
    description: 'Monto excluyendo impuestos',
    example: '100000.00',
  })
  @IsString()
  @IsNotEmpty()
  tax_exclusive_amount: string;

  @ApiProperty({
    description: 'Monto incluyendo impuestos',
    example: '119000.00',
  })
  @IsString()
  @IsNotEmpty()
  tax_inclusive_amount: string;

  @ApiProperty({
    description: 'Monto total de descuentos',
    example: '0.00',
    required: false,
  })
  @IsString()
  @IsOptional()
  allowance_total_amount?: string;

  @ApiProperty({
    description: 'Monto total a pagar',
    example: '119000.00',
  })
  @IsString()
  @IsNotEmpty()
  payable_amount: string;
}

export class TaxTotalDto {
  @ApiProperty({
    description: 'ID del impuesto',
    example: '01',
  })
  @IsString()
  @IsNotEmpty()
  tax_id: string;

  @ApiProperty({
    description: 'Monto del impuesto',
    example: '19000.00',
  })
  @IsString()
  @IsNotEmpty()
  tax_amount: string;

  @ApiProperty({
    description: 'Porcentaje del impuesto',
    example: '19.00',
    required: false,
  })
  @IsString()
  @IsOptional()
  percent?: string;

  @ApiProperty({
    description: 'Base gravable del impuesto',
    example: '100000.00',
    required: false,
  })
  @IsString()
  @IsOptional()
  taxable_amount?: string;
}

export class InvoiceLineDto {
  @ApiProperty({
    description: 'ID de la unidad de medida',
    example: '94',
  })
  @IsString()
  @IsNotEmpty()
  unit_measure_id: string;

  @ApiProperty({
    description: 'Cantidad facturada',
    example: '1.00',
  })
  @IsString()
  @IsNotEmpty()
  invoiced_quantity: string;

  @ApiProperty({
    description: 'Monto de extensión de línea',
    example: '100000.00',
  })
  @IsString()
  @IsNotEmpty()
  line_extension_amount: string;

  @ApiProperty({
    description: 'Indicador de gratuidad',
    example: 'false',
  })
  @IsString()
  @IsNotEmpty()
  free_of_charge_indicator: string;

  @ApiProperty({
    description: 'Descripción del producto o servicio',
    example: 'Consultoría en desarrollo de software',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Código del producto',
    example: 'CONS-001',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Precio unitario',
    example: '100000.00',
  })
  @IsString()
  @IsNotEmpty()
  price_amount: string;

  @ApiProperty({
    description: 'Cantidad base',
    example: '1.00',
  })
  @IsString()
  @IsNotEmpty()
  base_quantity: string;
}

export class AllowanceChargesDto {
  @ApiProperty({
    description: 'Indicador de cargo',
    example: 'false',
  })
  @IsString()
  @IsNotEmpty()
  charge_indicator: string;

  @ApiProperty({
    description: 'Razón del descuento o cargo',
    example: 'Descuento por pronto pago',
    required: false,
  })
  @IsString()
  @IsOptional()
  allowance_charge_reason?: string;

  @ApiProperty({
    description: 'Monto del descuento o cargo',
    example: '5000.00',
  })
  @IsString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({
    description: 'Monto base para el cálculo',
    example: '100000.00',
    required: false,
  })
  @IsString()
  @IsOptional()
  base_amount?: string;
}

export class EmailCCListDto {
  @ApiProperty({
    description: 'Correo electrónico para copia',
    example: 'copia@empresa.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'Número único de la factura',
    example: 'FACT-001',
  })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    description: 'ID del tipo de documento',
    example: '01',
  })
  @IsString()
  @IsNotEmpty()
  type_document_id: string;

  @ApiProperty({
    description: 'Fecha de emisión',
    example: '2024-01-15',
  })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'Hora de emisión',
    example: '10:30:00',
  })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Factura por servicios de consultoría',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({
    description: 'Número de resolución DIAN',
    example: '18760000001',
  })
  @IsString()
  @IsNotEmpty()
  resolution_number: string;

  @ApiProperty({
    description: 'Prefijo de la factura',
    example: 'FACT',
  })
  @IsString()
  @IsNotEmpty()
  prefix: string;

  @ApiProperty({
    description: 'Datos del cliente',
    type: CustomerDto,
  })
  @ValidateNested()
  @Type(() => CustomerDto)
  @IsNotEmpty()
  customer: CustomerDto;

  @ApiProperty({
    description: 'Forma de pago',
    type: PaymentFormDto,
  })
  @ValidateNested()
  @Type(() => PaymentFormDto)
  @IsNotEmpty()
  payment_form: PaymentFormDto;

  @ApiProperty({
    description: 'Totales monetarios legales',
    type: LegalMonetaryTotalsDto,
  })
  @ValidateNested()
  @Type(() => LegalMonetaryTotalsDto)
  @IsNotEmpty()
  legal_monetary_totals: LegalMonetaryTotalsDto;

  @ApiProperty({
    description: 'Impuestos de retención',
    type: [TaxTotalDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxTotalDto)
  @IsOptional()
  with_holding_tax_total?: TaxTotalDto[];

  @ApiProperty({
    description: 'Totales de impuestos',
    type: [TaxTotalDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxTotalDto)
  @IsNotEmpty()
  tax_totals: TaxTotalDto[];

  @ApiProperty({
    description: 'Líneas de la factura',
    type: [InvoiceLineDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InvoiceLineDto)
  @IsNotEmpty()
  invoice_lines: InvoiceLineDto[];

  @ApiProperty({
    description: 'Enviar por correo electrónico',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  sendmail?: boolean = true;

  @ApiProperty({
    description: 'Enviar credenciales al cliente',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  send_customer_credentials?: boolean = false;

  @ApiProperty({
    description: 'ID de referencia de documento adicional',
    example: 'REF-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  AdditionalDocumentReferenceID?: string;

  @ApiProperty({
    description: 'Fecha de referencia de documento adicional',
    example: '2024-01-10',
    required: false,
  })
  @IsString()
  @IsOptional()
  AdditionalDocumentReferenceDate?: string;

  @ApiProperty({
    description: 'Tipo de documento de referencia adicional',
    example: '01',
    required: false,
  })
  @IsString()
  @IsOptional()
  AdditionalDocumentReferenceTypeDocument?: string;

  @ApiProperty({
    description: 'Descuentos y cargos',
    type: [AllowanceChargesDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AllowanceChargesDto)
  @IsOptional()
  allowance_charges?: AllowanceChargesDto[];

  @ApiProperty({
    description: 'Nota de encabezado',
    example: 'Factura electrónica',
    required: false,
  })
  @IsString()
  @IsOptional()
  head_note?: string;

  @ApiProperty({
    description: 'Código SEZE',
    example: 'SEZE001',
    required: false,
  })
  @IsString()
  @IsOptional()
  seze?: string;

  @ApiProperty({
    description: 'Lista de correos en copia',
    type: [EmailCCListDto],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailCCListDto)
  @IsOptional()
  email_cc_list?: EmailCCListDto[];
} 