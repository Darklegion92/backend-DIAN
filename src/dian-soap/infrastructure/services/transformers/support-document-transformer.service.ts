import { Injectable } from "@nestjs/common";
import { DocumentTransformer } from "./document-transformer.interface";
import { CargosDescuentoDto, FacturaDetalleDto, FacturaGeneralDto, MedioDePagoDto } from "@/dian-soap/presentation/dtos/request/factura-general.dto";
import { GenerateDataService } from "@/common/infrastructure/services/generate-data.service";
import { CatalogService } from "@/catalog/application/services/catalog.service";
import { SupportDocumentRequestDto } from "@/support-document/domain/interfaces/support-document.interface";
import { ResolutionService } from "@/resolutions/application/services/resolution.service";
import { AllowanceChargeDto, LegalMonetaryTotalsDto, LineDto, PaymentFormDto } from "@/common/domain/interfaces/document-common.interface";

@Injectable()
export class SupportDocumentTransformerService implements DocumentTransformer<SupportDocumentRequestDto> {

    constructor(
        private readonly generateDataService: GenerateDataService, 
        private readonly catalogService: CatalogService, 
        private readonly resolutionService: ResolutionService) { }

  async transform(factura: FacturaGeneralDto, companyId: number, token: string): Promise<SupportDocumentRequestDto> {
    
    const prefix = factura.rangoNumeracion.split('-')[0];
    const number = factura.consecutivoDocumento.replace(prefix, '');
    const date = factura.fechaEmision.split(' ')[0];
    const time = factura.fechaEmision.split(' ')[1];

    const customer = await this.generateDataService.generateCustomer(factura.cliente, this.catalogService, token);

    const resolutionNumber = await this.resolutionService.getResolutionNumber(prefix, companyId);

    const paymentForm = await this.generatePaymentForms(factura.mediosDePago.MediosDePago);

    const legalMonetaryTotals: LegalMonetaryTotalsDto = {
        line_extension_amount: Number(factura.totalBaseImponible),
        tax_exclusive_amount: Number(factura.totalSinImpuestos),
        tax_inclusive_amount: Number(factura.totalBrutoConImpuesto),
        payable_amount: Number(factura.totalMonto),
        allowance_total_amount: Number(factura.totalDescuentos),
        charge_total_amount: Number(factura.totalCargosAplicados),
      };

    const { with_holding_taxes } = await this.generateDataService.generateTaxtotals(factura.impuestosGenerales?.FacturaImpuestos || [], this.catalogService);

    const invoiceLines = await this.generateInvoiceLines(factura.detalleDeFactura.FacturaDetalle, date);

    

   return {
        number: Number(number),
        type_document_id: 11,
        date: date,
        time: time,
        sendmail: true,
        resolution_number: resolutionNumber,
        prefix,
        seller: customer,
        payment_form: paymentForm,
        legal_monetary_totals: legalMonetaryTotals,
        invoice_lines: invoiceLines.map((line) =>({...line, tax_totals: null})),
        tax_totals: null,
        withholding_tax_totals: with_holding_taxes,
    };
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
   * Genera las líneas de la factura
   * @param facturaDetalle - Detalle de la factura
   * @returns LineDto[] - Líneas de la factura
   */
   async generateInvoiceLines(facturaDetalle: FacturaDetalleDto | FacturaDetalleDto[], date: string): Promise<LineDto[]> {
    const invoiceLines: LineDto[] = [];

    if (typeof facturaDetalle === "string") {
      return invoiceLines;
    }


    if (Array.isArray(facturaDetalle)) {

      for (const detalle of facturaDetalle) {
        const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(detalle.unidadMedida);
        const typeItemIdentificationId = await this.catalogService.getTypeItemIdentificationIdByCode(detalle.estandarCodigoProducto);

        const { taxes, allowance_charges } = await this.generateDataService.generateTaxtotals(detalle.impuestosDetalles.FacturaImpuestos, this.catalogService, Number(detalle.cantidadUnidades));

        const allowanceChargesGeneral: AllowanceChargeDto[] = this.generateAllowanceCharges(detalle.cargosDescuentos?.CargosDescuentos);

        const allowanceCharges: AllowanceChargeDto[] = allowance_charges.concat(allowanceChargesGeneral);

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
          type_generation_transmition_id: 1,
          start_date:date

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
        type_generation_transmition_id: 1,
        start_date:date
      });
    }

    return invoiceLines;
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