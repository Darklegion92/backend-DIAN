import { Injectable } from '@nestjs/common';
import { DocumentTransformer } from './document-transformer.interface';
import { CargosDescuentoDto, ClienteDto, FacturaDetalleDto, FacturaGeneralDto, FacturaImpuestosDto, MedioDePagoDto } from '../../../presentation/dtos/request/factura-general.dto';
import { InvoiceRequestDto } from '@/invoice/domain/interfaces/invoice-request.interface';
import { CatalogService } from '@/catalog/application/services/catalog.service';
import { AllowanceChargeDto, LegalMonetaryTotalsDto, LineDto, PaymentFormDto, SellerOrCustomerDto, TaxTotalDto } from '@/common/domain/interfaces/document-common.interface';
import { ResolutionService } from '@/resolutions/application/services/resolution.service';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';

@Injectable()
export class InvoiceTransformerService implements DocumentTransformer<InvoiceRequestDto> {
  constructor(private readonly catalogService: CatalogService, private readonly resolutionService: ResolutionService, private readonly generateDataService: GenerateDataService) { }



  /**
   * Transforma la factura a un objeto InvoiceRequestDto
   * @param factura - Factura a transformar
   * @param companyId - ID de la empresa
   * @returns InvoiceRequestDto - Objeto transformado
   */
  async transform(factura: FacturaGeneralDto, companyId: number, token: string, code?: string): Promise<InvoiceRequestDto> {

    if (!factura.cliente) {
      throw new Error('El cliente es requerido para la factura');
    }

    const prefix = factura.rangoNumeracion.split('-')[0];
    const number = factura.consecutivoDocumento.replace(prefix, '');
    const date = factura.fechaEmision.split(' ')[0];
    const time = factura.fechaEmision.split(' ')[1];

    const resolutionNumber = await this.resolutionService.getResolutionNumber(prefix, companyId);


    const legalMonetaryTotals: LegalMonetaryTotalsDto = {
      line_extension_amount: Number(factura.totalBaseImponible),
      tax_exclusive_amount: Number(factura.totalSinImpuestos),
      tax_inclusive_amount: Number(factura.totalBrutoConImpuesto),
      payable_amount: Number(factura.totalMonto),
      allowance_total_amount: Number(factura.totalDescuentos),
      charge_total_amount: Number(factura.totalCargosAplicados),
    };

    const { taxes, with_holding_taxes } = await this.generateDataService.generateTaxtotals(factura.impuestosGenerales?.FacturaImpuestos || [], this.catalogService);
    const customer = await this.generateDataService.generateCustomer(factura.cliente, this.catalogService, token);
    const invoiceLines = await this.generateInvoiceLines(factura.detalleDeFactura.FacturaDetalle, taxes);

    const paymentForm = await this.generatePaymentForms(factura.mediosDePago.MediosDePago);

    //TODO: validamos si el iva de 0% que manda

    const totalTaxes: number = taxes.reduce((acc, tax) => acc + (tax.percent === 0 ? tax.taxable_amount : 0), 0);
    const totalTaxesDetail: number = invoiceLines.reduce((acc, line) => acc + (line.tax_totals.reduce((acc, tax) => acc + (tax.percent === 0 && tax.tax_id === 1 ? tax.taxable_amount : 0), 0)), 0);


    if (totalTaxes !== totalTaxesDetail) {
      const diff = totalTaxesDetail - totalTaxes;

      const existTaxZero = taxes.some(tax => tax.percent === 0 && tax.tax_id === 1);
      if(!existTaxZero){
        for(const line of invoiceLines){
          if(line.tax_totals.some(tax => tax.percent === 0 && tax.tax_id === 1)){
            if(line.tax_totals.length > 1){
              line.tax_totals = line.tax_totals.filter(tax => tax.tax_id !== 1);
            }else{
              legalMonetaryTotals.tax_exclusive_amount = legalMonetaryTotals.tax_exclusive_amount - line.tax_totals[0].taxable_amount;
              delete line.tax_totals;
            }
          }
        }
      
      }else{

      const index = invoiceLines.findIndex(line => line.tax_totals.some(tax => tax.percent === 0 && tax.tax_id === 1 && tax.taxable_amount === diff));
      if (index !== -1) {
        if(invoiceLines[index].tax_totals.length > 1){
          invoiceLines[index].tax_totals = invoiceLines[index].tax_totals.filter(tax => tax.tax_id !== 1);
        }else{
          legalMonetaryTotals.tax_exclusive_amount = legalMonetaryTotals.tax_exclusive_amount - diff;
          delete invoiceLines[index].tax_totals;
        }
      }
    }

    }

    const additionalInfo = factura.informacionAdicional?.string;
    
    let notes = ""
    let seze = ""

    if(typeof additionalInfo === 'string'){

        if(additionalInfo.toLowerCase().includes('zese') || additionalInfo.toLowerCase().includes('seze')){
          seze = additionalInfo;
        }else{
          notes = additionalInfo;
        }      
    }else if(Array.isArray(additionalInfo)){
      for(const info of additionalInfo){
        if(info.toLowerCase().includes('zese') || info.toLowerCase().includes('seze')){
          seze = info;
        }else{
          notes = info;
        }
      }
    }

    
    return {
      number: parseInt(number),
      prefix,
      type_document_id: 1,
      date,
      time,
      resolution_number: resolutionNumber,
      notes,
      customer,
      legal_monetary_totals: legalMonetaryTotals,
      invoice_lines: invoiceLines,
      payment_form: paymentForm,
      tax_totals: taxes,
      sendmail: this.generateDataService.sendEmail(customer.email, customer.identification_number, code),
      with_holding_tax_total: with_holding_taxes.length > 0 ? with_holding_taxes : undefined,
      seze,
    };

  }





  /**
   * Genera las líneas de la factura
   * @param facturaDetalle - Detalle de la factura
   * @returns LineDto[] - Líneas de la factura
   */
  async generateInvoiceLines(facturaDetalle: FacturaDetalleDto | FacturaDetalleDto[], taxes: TaxTotalDto[]): Promise<LineDto[]> {
    const invoiceLines: LineDto[] = [];

    if (typeof facturaDetalle === "string") {
      return invoiceLines;
    }
    let haveExcents = false;


    if (Array.isArray(facturaDetalle)) {

      for (const detalle of facturaDetalle) {
        const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(detalle.unidadMedida);
        const typeItemIdentificationId = await this.catalogService.getTypeItemIdentificationIdByCode(detalle.estandarCodigoProducto);

        const { taxes, allowance_charges } = await this.generateDataService.generateTaxtotals(detalle.impuestosDetalles.FacturaImpuestos, this.catalogService, Number(detalle.cantidadUnidades));

        const allowanceChargesGeneral: AllowanceChargeDto[] = this.generateAllowanceCharges(detalle.cargosDescuentos?.CargosDescuentos);

        const allowanceCharges: AllowanceChargeDto[] = allowance_charges.concat(allowanceChargesGeneral);

        //TODO: buscar si existe el

        invoiceLines.push({
          unit_measure_id: unitMeasureId,
          invoiced_quantity: Number(detalle.cantidadUnidades),
          line_extension_amount: Number(detalle.precioTotalSinImpuestos),
          tax_totals: taxes,
          description: detalle.descripcion,
          code: detalle.codigoProducto,
          type_item_identification_id: typeItemIdentificationId,
          price_amount: Number(detalle.precioVentaUnitario),
          base_quantity: Number(detalle.cantidadPorEmpaque),
          free_of_charge_indicator: false,
          allowance_charges: allowanceCharges.length > 0 ? allowanceCharges : undefined,

        });
      }
    } else {

      const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(facturaDetalle.unidadMedida);
      const typeItemIdentificationId = await this.catalogService.getTypeItemIdentificationIdByCode(facturaDetalle.estandarCodigoProducto);
      const { taxes, allowance_charges } = await this.generateDataService.generateTaxtotals(facturaDetalle.impuestosDetalles.FacturaImpuestos, this.catalogService, Number(facturaDetalle.cantidadUnidades));

      const allowanceChargesGeneral: AllowanceChargeDto[] = this.generateAllowanceCharges(facturaDetalle?.cargosDescuentos?.CargosDescuentos);

      const allowanceCharges: AllowanceChargeDto[] = allowance_charges.concat(allowanceChargesGeneral);

      invoiceLines.push({
        unit_measure_id: unitMeasureId,
        invoiced_quantity: Number(facturaDetalle.cantidadUnidades),
        line_extension_amount: Number(facturaDetalle.precioTotalSinImpuestos),
        tax_totals: taxes,
        description: facturaDetalle.descripcion,
        code: facturaDetalle.codigoProducto,
        type_item_identification_id: typeItemIdentificationId,
        price_amount: Number(facturaDetalle.precioVentaUnitario),
        base_quantity: Number(facturaDetalle.cantidadPorEmpaque),
        free_of_charge_indicator: false,
        allowance_charges: allowanceCharges.length > 0 ? allowanceCharges : undefined,
      });
    }


    if (haveExcents) {
      //TODO: debemos agregar a todos allowance_charge con el valor del impuesto
    }

    return invoiceLines;
  }

  /**
   * Genera los medios de pago de la factura
   * @param mediosDePago - Medios de pago de la factura
   * @returns PaymentFormDto[] - Medios de pago de la factura
   */
  async generatePaymentForms(mediosDePago: MedioDePagoDto | MedioDePagoDto[]): Promise<PaymentFormDto[]> {

    const paymentForms: PaymentFormDto[] = [];

    if (typeof mediosDePago === "string") {
      return paymentForms;
    }

    if (Array.isArray(mediosDePago)) {
      for (const medioDePago of mediosDePago) {
        const paymentFormId = await this.catalogService.getPaymentFormIdByCode(medioDePago.metodoDePago);
        const paymentMethodId = await this.catalogService.getPaymentMethodIdByCode(medioDePago.medioPago);


        const paymentForm: PaymentFormDto = {
          payment_form_id: paymentFormId,
          payment_method_id: paymentMethodId,
          payment_due_date: medioDePago.fechaDeVencimiento,
          duration_measure: Number(medioDePago.numeroDias),
        };

        paymentForms.push(paymentForm);
      }
    } else {
      const paymentFormId = await this.catalogService.getPaymentFormIdByCode(mediosDePago.metodoDePago);
      const paymentMethodId = await this.catalogService.getPaymentMethodIdByCode(mediosDePago.medioPago);
      const paymentForm: PaymentFormDto = {
        payment_form_id: paymentFormId,
        payment_method_id: paymentMethodId,
        payment_due_date: mediosDePago.fechaDeVencimiento,
        duration_measure: Number(mediosDePago.numeroDias),
      };
      paymentForms.push(paymentForm);
    }

    return paymentForms;
  }

  /**
   * Genera los cargos y descuentos de la factura
   * @param cargosDescuento - Cargos y descuentos de la factura
   * @returns AllowanceChargeDto[] - Cargos y descuentos de la factura
   */
  generateAllowanceCharges(cargosDescuento: CargosDescuentoDto | CargosDescuentoDto[]): AllowanceChargeDto[] {
    const allowanceCharges: AllowanceChargeDto[] = [];

    if (typeof cargosDescuento === "string" || !cargosDescuento) {
      return allowanceCharges;
    }

    if (Array.isArray(cargosDescuento)) {
      cargosDescuento.forEach((cargosDescuento) => {
        const allowanceCharge: AllowanceChargeDto = {
          charge_indicator: cargosDescuento.indicador === "1",
          allowance_charge_reason: cargosDescuento.descripcion,
          amount: Number(cargosDescuento.monto),
          base_amount: Number(cargosDescuento.montoBase),
        };
        allowanceCharges.push(allowanceCharge);
      });
    } else {
      const allowanceCharge: AllowanceChargeDto = {
        charge_indicator: false,
        allowance_charge_reason: cargosDescuento.descripcion,
        amount: Number(cargosDescuento.monto),
        base_amount: Number(cargosDescuento.montoBase),
      };
      allowanceCharges.push(allowanceCharge);
    }
    return allowanceCharges;
  }
} 