import { Injectable } from '@nestjs/common';
import { DocumentTransformer } from './document-transformer.interface';
import { DocumentoReferenciadoDto, FacturaDetalleDto, FacturaGeneralDto } from '../../../presentation/dtos/request/factura-general.dto';
import { CreditNoteRequestDto } from '@/credit-note/domain/interfaces/credit-note.interface';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { CatalogService } from '@/catalog/application/services/catalog.service';
import { BillingReferenceDto, LegalMonetaryTotalsDto } from '@/common/domain/interfaces/document-common.interface';
import { LineDto } from '@/common/domain/interfaces/document-common.interface';

@Injectable()
export class CreditNoteTransformerService implements DocumentTransformer<CreditNoteRequestDto> {
  constructor(private readonly generateDataService: GenerateDataService, private readonly catalogService: CatalogService) { }
  async transform(factura: FacturaGeneralDto, _: number, token: string): Promise<CreditNoteRequestDto> {

    const prefix = factura.rangoNumeracion.split('-')[0];
    const number = factura.consecutivoDocumento.replace(prefix, '');
    const date = factura.fechaEmision.split(' ')[0];
    const time = factura.fechaEmision.split(' ')[1];

    const customer = await this.generateDataService.generateCustomer(factura.cliente, this.catalogService, token);

    const creditNoteLines = await this.generateCreditNoteLines(factura.detalleDeFactura.FacturaDetalle);

    const billingReference = await this.generateBillingReference(factura.documentosReferenciados.DocumentoReferenciado);
    
    const { taxes } = await this.generateDataService.generateTaxtotals(factura.impuestosGenerales.FacturaImpuestos, this.catalogService);

    const typeOperationId = await this.catalogService.getTypeOperationIdByCode(factura.tipoOperacion);


    const legalMonetaryTotals: LegalMonetaryTotalsDto = {
      line_extension_amount: Number(factura.totalBaseImponible),
      tax_exclusive_amount: Number(factura.totalSinImpuestos),
      tax_inclusive_amount: Number(factura.totalBrutoConImpuesto),
      payable_amount: Number(factura.totalMonto),
      allowance_total_amount: Number(factura.totalDescuentos),
      charge_total_amount: Number(factura.totalCargosAplicados),
    };


    const totalTaxes: number = taxes.reduce((acc, tax) => acc + (tax.percent === 0 ? tax.taxable_amount : 0), 0);
    const totalTaxesDetail: number = creditNoteLines.reduce((acc, line) => acc + (line.tax_totals.reduce((acc, tax) => acc + (tax.percent === 0 && tax.tax_id === 1 ? tax.taxable_amount : 0), 0)), 0);


    if (totalTaxes !== totalTaxesDetail) {
      const diff = totalTaxesDetail - totalTaxes;

      const existTaxZero = taxes.some(tax => tax.percent === 0 && tax.tax_id === 1);
      if(!existTaxZero){
        for(const line of creditNoteLines){
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

      const index = creditNoteLines.findIndex(line => line.tax_totals.some(tax => tax.percent === 0 && tax.tax_id === 1 && tax.taxable_amount === diff));
      if (index !== -1) {
        if(creditNoteLines[index].tax_totals.length > 1){
          creditNoteLines[index].tax_totals = creditNoteLines[index].tax_totals.filter(tax => tax.tax_id !== 1);
        }else{
          legalMonetaryTotals.tax_exclusive_amount = legalMonetaryTotals.tax_exclusive_amount - diff;
          delete creditNoteLines[index].tax_totals;
        }
      }
    }

    }

    const sendMail = await this.generateDataService.sendEmail(customer.email, customer.identification_number.toString(), number);

    const emails = customer.email.split(';');
    let cc = [];
    if(emails.length > 1){
      customer.email = emails[0];
      cc = emails.slice(1).map(email => ({ email }));
    }

    return {
      type_document_id: 4,
      discrepancyresponsecode: 1,
      resolution_number: "1",
      prefix,
      number: parseInt(number),
      date,
      time,
      sendmail: sendMail,
      email_cc_list: cc,
      customer,
      credit_note_lines: creditNoteLines,
      billing_reference: billingReference,
      legal_monetary_totals: legalMonetaryTotals,
      tax_totals: taxes,
      type_operation_id: typeOperationId,
      notes: factura.informacionAdicional?.string === 'string'  ? factura.informacionAdicional.string : factura.informacionAdicional?.string[0]
    };
  }

  /**
   * Genera las líneas de la factura
   * @param notaCreditoDetalle - Detalle de la factura
   * @returns LineDto[] - Líneas de la factura
   */
  async generateCreditNoteLines(notaCreditoDetalle: FacturaDetalleDto | FacturaDetalleDto[]): Promise<LineDto[]> {
    const invoiceLines: LineDto[] = [];

    if (typeof notaCreditoDetalle === "string") {
      return invoiceLines;
    }


    if (Array.isArray(notaCreditoDetalle)) {

      for (const detalle of notaCreditoDetalle) {
        const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(detalle.unidadMedida);
        const typeItemIdentificationId = await this.catalogService.getTypeItemIdentificationIdByCode(detalle.estandarCodigoProducto);
        const { taxes } = await this.generateDataService.generateTaxtotals(detalle.impuestosDetalles.FacturaImpuestos, this.catalogService);


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
        });
      }
    } else {

      const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(notaCreditoDetalle.unidadMedida);
      const typeItemIdentificationId = await this.catalogService.getTypeItemIdentificationIdByCode(notaCreditoDetalle.estandarCodigoProducto);
      const { taxes } = await this.generateDataService.generateTaxtotals(notaCreditoDetalle.impuestosDetalles.FacturaImpuestos, this.catalogService);     

      invoiceLines.push({
        unit_measure_id: unitMeasureId,
        invoiced_quantity: Number(notaCreditoDetalle.cantidadUnidades),
        line_extension_amount: Number(notaCreditoDetalle.precioTotalSinImpuestos),
        tax_totals: taxes,
        description: notaCreditoDetalle.descripcion,
        code: notaCreditoDetalle.codigoProducto,
        type_item_identification_id: typeItemIdentificationId,
        price_amount: Number(notaCreditoDetalle.precioVentaUnitario),
        base_quantity: Number(notaCreditoDetalle.cantidadPorEmpaque),
        free_of_charge_indicator: false,
      });
    }

    return invoiceLines;
  }

  /**
   * Genera la referencia de facturación
   * @param documentosReferenciados - Documentos referenciados
   * @returns BillingReferenceDto - Referencia de facturación
   */
  async generateBillingReference(documentosReferenciados: DocumentoReferenciadoDto | DocumentoReferenciadoDto[]): Promise<BillingReferenceDto> {

    if (Array.isArray(documentosReferenciados)) {
      return {
        number: documentosReferenciados[0].numeroDocumento,
        uuid: documentosReferenciados[0].cufeDocReferenciado,
        issue_date: documentosReferenciados[0].fecha,
      }
    }


    return {
      number: documentosReferenciados.numeroDocumento,
      uuid: documentosReferenciados.cufeDocReferenciado,
      issue_date: documentosReferenciados.fecha,
    };

  }
} 