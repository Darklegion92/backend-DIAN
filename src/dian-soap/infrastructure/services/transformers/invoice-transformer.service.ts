import { Injectable } from '@nestjs/common';
import { DocumentTransformer } from './document-transformer.interface';
import { ClienteDto, FacturaDetalleDto, FacturaGeneralDto, FacturaImpuestosDto, MedioDePagoDto } from '../../../presentation/dtos/request/factura-general.dto';
import { InvoiceRequestDto } from '@/invoice/domain/interfaces/invoice-request.interface';
import { CatalogService } from '@/catalog/application/services/catalog.service';
import { LegalMonetaryTotalsDto, LineDto, PaymentFormDto, SellerOrCustomerDto, TaxTotalDto } from '@/common/domain/interfaces/document-common.interface';
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
  async transform(factura: FacturaGeneralDto, companyId: number): Promise<InvoiceRequestDto> {

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

    const customer = await this.generateCustomer(factura.cliente);
    const invoiceLines = await this.generateInvoiceLines(factura.detalleDeFactura.FacturaDetalle);

    const paymentForm = await this.generatePaymentForms(factura.mediosDePago.MediosDePago);

    const taxTotals = await this.generateTaxtotals(factura.impuestosGenerales.FacturaImpuestos);
    
    return {
      number: parseInt(number),
      prefix,
      type_document_id: 1,
      date,
      time,
      resolution_number: resolutionNumber,
      notes: '',
      customer,
      legal_monetary_totals: legalMonetaryTotals,
      invoice_lines: invoiceLines,
      payment_form: paymentForm,
      tax_totals: taxTotals,
      sendmail: this.generateDataService.sendEmail(customer),
    };

  }


  /**
   * Genera el cliente de la factura
   * @param cliente - Cliente de la factura
   * @returns SellerOrCustomerDto - Cliente de la factura
   */
  async generateCustomer(cliente: ClienteDto): Promise<SellerOrCustomerDto> {
    const typeDocumentIdentificationId = await this.catalogService.getDocumentTypeIdByCode(cliente.tipoIdentificacion);
    const municipalityId = await this.catalogService.getMunicipalityIdByCode(cliente.direccionCliente.municipio);
    const typeLiabilityId = await this.catalogService.getLiabilityTypeIdByCode(cliente.responsabilidadesRut.Obligaciones.obligaciones);
    const typeRegimeId = await this.catalogService.getRegimeTypeIdByCode(cliente.responsabilidadesRut.Obligaciones.regimen);

    return {
      identification_number: cliente.numeroDocumento,
      dv: cliente.numeroIdentificacionDV,
      name: cliente.nombreRazonSocial,
      phone: cliente.telefono,
      email: cliente.email,
      merchant_registration: cliente.informacionLegalCliente.numeroMatriculaMercantil,
      type_document_identification_id: typeDocumentIdentificationId,
      type_organization_id: Number(cliente.tipoPersona),
      municipality_id: municipalityId,
      type_liability_id: typeLiabilityId,
      type_regime_id: typeRegimeId,
      postal_zone_code: cliente.direccionCliente.zonaPostal,
      address: cliente.direccionCliente.direccion,
      
    };
  }


  /**
   * Genera las líneas de la factura
   * @param facturaDetalle - Detalle de la factura
   * @returns LineDto[] - Líneas de la factura
   */
  async generateInvoiceLines(facturaDetalle: FacturaDetalleDto | FacturaDetalleDto[]): Promise<LineDto[]> {
    const invoiceLines: LineDto[] = [];


    if (Array.isArray(facturaDetalle)) {
      await facturaDetalle.forEach(async (detalle) => {
        const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(detalle.unidadMedida);
        const typeItemIdentificationId = await this.catalogService.getTypeItemIdentificationIdByCode(detalle.estandarCodigoProducto);
        const impuestos = await this.generateTaxtotals(detalle.impuestosDetalles.FacturaImpuestos);

        invoiceLines.push({
          unit_measure_id: unitMeasureId,
          invoiced_quantity: Number(detalle.cantidadUnidades),
          line_extension_amount: Number(detalle.precioTotalSinImpuestos),
          tax_totals: impuestos,
          description: detalle.descripcion,
          code: detalle.codigoProducto,
          type_item_identification_id: typeItemIdentificationId,
          price_amount: Number(detalle.precioVentaUnitario),
          base_quantity: Number(detalle.cantidadPorEmpaque),
          free_of_charge_indicator: false,

        });
      });
    } else {

      const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(facturaDetalle.unidadMedida);
      const typeItemIdentificationId = await this.catalogService.getTypeItemIdentificationIdByCode(facturaDetalle.estandarCodigoProducto);
      const impuestos = await this.generateTaxtotals(facturaDetalle.impuestosDetalles.FacturaImpuestos);

      invoiceLines.push({
        unit_measure_id: unitMeasureId,
        invoiced_quantity: Number(facturaDetalle.cantidadUnidades),
        line_extension_amount: Number(facturaDetalle.precioTotalSinImpuestos),
        tax_totals: impuestos,
        description: facturaDetalle.descripcion,
        code: facturaDetalle.codigoProducto,
        type_item_identification_id: typeItemIdentificationId,
        price_amount: Number(facturaDetalle.precioVentaUnitario),
        base_quantity: Number(facturaDetalle.cantidadPorEmpaque),
        free_of_charge_indicator: false,
      });
    }

    return invoiceLines;
  }

  /**
   * Genera los impuestos de la factura
   * @param impuestos - Impuestos de la factura
   * @returns TaxTotalDto[] - Impuestos de la factura
   */
  async generateTaxtotals(impuestos: FacturaImpuestosDto | FacturaImpuestosDto[]): Promise<TaxTotalDto[]> {
    const taxTotals: TaxTotalDto[] = [];

    if (Array.isArray(impuestos)) {
      await impuestos.forEach(async (impuesto) => {
        const taxtId = await this.catalogService.getTaxIdByCode(impuesto.codigoTOTALImp);
        const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(impuesto.unidadMedida);
        taxTotals.push({
          tax_id: taxtId,
          tax_amount: Number(impuesto.valorTOTALImp),
          percent: Number(impuesto.porcentajeTOTALImp),
          taxable_amount: Number(impuesto.baseImponibleTOTALImp),
          unit_measure_id: unitMeasureId,
        });
      });
    } else {
      const taxtId = await this.catalogService.getTaxIdByCode(impuestos.codigoTOTALImp);
      const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(impuestos.unidadMedida);
      taxTotals.push({
        tax_id: taxtId,
        tax_amount: Number(impuestos.valorTOTALImp),
        percent: Number(impuestos.porcentajeTOTALImp),
        taxable_amount: Number(impuestos.baseImponibleTOTALImp),
        unit_measure_id: unitMeasureId,
      });
    }

    return taxTotals;
  }


  /**
   * Genera los medios de pago de la factura
   * @param mediosDePago - Medios de pago de la factura
   * @returns PaymentFormDto[] - Medios de pago de la factura
   */
  async generatePaymentForms(mediosDePago: MedioDePagoDto | MedioDePagoDto[]): Promise<PaymentFormDto[]> {

    const paymentForms: PaymentFormDto[] = [];

    if (Array.isArray(mediosDePago)) {
      await mediosDePago.forEach(async (medioDePago) => {
        const paymentFormId = await this.catalogService.getPaymentFormIdByCode(medioDePago.metodoDePago);
        const paymentMethodId = await this.catalogService.getPaymentMethodIdByCode(medioDePago.medioPago);


        const paymentForm: PaymentFormDto = {
          payment_form_id: paymentFormId,
          payment_method_id: paymentMethodId,
          payment_due_date: medioDePago.fechaDeVencimiento,
          duration_measure: Number(medioDePago.numeroDias),
        };

        paymentForms.push(paymentForm);
      });
    }else{
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
} 