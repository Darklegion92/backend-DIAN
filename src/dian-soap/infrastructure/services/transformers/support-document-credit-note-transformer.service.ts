import { Injectable } from '@nestjs/common';
import { DocumentTransformer } from './document-transformer.interface';
import { DocumentoReferenciadoDto, FacturaDetalleDto, FacturaGeneralDto } from '../../../presentation/dtos/request/factura-general.dto';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { CatalogService } from '@/catalog/application/services/catalog.service';
import { BillingReferenceDto, LegalMonetaryTotalsDto } from '@/common/domain/interfaces/document-common.interface';
import { LineDto } from '@/common/domain/interfaces/document-common.interface';
import { SdCreditNoteRequestDto } from '@/credit-note/domain/interfaces/credit-note-document-support.interface';

@Injectable()
export class SupportDocumentCreditNoteTransformerService implements DocumentTransformer<SdCreditNoteRequestDto> {
  constructor(private readonly generateDataService: GenerateDataService, private readonly catalogService: CatalogService) { }
  
  private round2(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }

  private round6(num: number): number {
    return Math.round((num + Number.EPSILON) * 1000000) / 1000000;
  }

  async transform(factura: FacturaGeneralDto, _: number, token: string): Promise<SdCreditNoteRequestDto> {

    const prefix = factura.rangoNumeracion.split('-')[0];
    const number = factura.consecutivoDocumento.replace(prefix, '');
    const date = factura.fechaEmision.split(' ')[0];
    const time = factura.fechaEmision.split(' ')[1];

    const seller = await this.generateDataService.generateCustomer(factura.cliente, this.catalogService, token);

    const creditNoteLines = await this.generateCreditNoteLines(factura.detalleDeFactura.FacturaDetalle);

    const billingReference = await this.generateBillingReference(factura.documentosReferenciados.DocumentoReferenciado);
    
    const { taxes } = await this.generateDataService.generateTaxtotals(factura.impuestosGenerales.FacturaImpuestos, this.catalogService);

    const typeOperationId = await this.catalogService.getTypeOperationIdByCode(factura.tipoOperacion);


    // Recalcular totales basados en las líneas para asegurar consistencia
    const lineExtensionAmount = creditNoteLines.reduce((sum, line) => sum + line.line_extension_amount, 0);
    
    // Asumimos que si no hay impuestos globales diferentes a la suma de impuestos de línea, usamos el calculado
    const totalTaxes = taxes.reduce((acc, tax) => acc + (tax.percent === 0 ? tax.taxable_amount : 0), 0);
    
    let taxExclusiveAmount = this.round2(lineExtensionAmount);
    let taxInclusiveAmount = this.round2(lineExtensionAmount);
    let payableAmount = this.round2(lineExtensionAmount);
    
    // Si hay impuestos, recalcular con impuestos
    if (taxes.length > 0) {
         const taxAmountTotal = taxes.reduce((acc, t) => acc + Number(t.tax_amount), 0);
         taxInclusiveAmount = this.round2(taxExclusiveAmount + taxAmountTotal);
         payableAmount = taxInclusiveAmount;
    }
    
    const legalMonetaryTotals: LegalMonetaryTotalsDto = {
      line_extension_amount: this.round2(lineExtensionAmount),
      tax_exclusive_amount: taxExclusiveAmount,
      tax_inclusive_amount: taxInclusiveAmount,
      payable_amount: payableAmount,
      allowance_total_amount: Number(factura.totalDescuentos),
      charge_total_amount: Number(factura.totalCargosAplicados),
    };


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

    const sendMail = await this.generateDataService.sendEmail(seller.email, seller.identification_number.toString(), number);

    const emails = seller.email.split(';');
    let cc = [];
    if(emails.length > 1){
      seller.email = emails[0];
      cc = emails.slice(1).map(email => ({ email }));
    }

    return {
      type_document_id: 13,
      discrepancyresponsecode: 2,
      resolution_number: null,
      prefix,
      number: parseInt(number),
      date,
      time,
      sendmail: sendMail,
      email_cc_list: cc,
      seller,
      credit_note_lines: creditNoteLines,
      billing_reference: billingReference,
      legal_monetary_totals: legalMonetaryTotals,
      tax_totals: taxes,
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

        // Recalcular precio unitario basado en el total de línea para evitar errores de redondeo (NSAV06)
        const quantity = Number(detalle.cantidadUnidades);
        const lineExtensionAmount = this.round2(Number(detalle.precioTotalSinImpuestos));
        
        // Recalcular siempre el precio unitario para garantizar consistencia con el total
        let priceAmount = 0;
        if (quantity !== 0) {
             priceAmount = lineExtensionAmount / quantity;
             priceAmount = this.round6(priceAmount);
        }

        invoiceLines.push({
          unit_measure_id: unitMeasureId,
          invoiced_quantity: quantity,
          line_extension_amount: lineExtensionAmount,
          tax_totals: taxes,
          description: detalle.descripcion,
          code: detalle.codigoProducto,
          type_item_identification_id: typeItemIdentificationId,
          price_amount: priceAmount,
          base_quantity: Number(detalle.cantidadPorEmpaque),
          free_of_charge_indicator: false,
        });
      }
    } else {

      const unitMeasureId = await this.catalogService.getUnitMeasureIdByCode(notaCreditoDetalle.unidadMedida);
      const typeItemIdentificationId = await this.catalogService.getTypeItemIdentificationIdByCode(notaCreditoDetalle.estandarCodigoProducto);
      const { taxes } = await this.generateDataService.generateTaxtotals(notaCreditoDetalle.impuestosDetalles.FacturaImpuestos, this.catalogService);     

        // Recalcular precio unitario basado en el total de línea para evitar errores de redondeo (NSAV06)
        const quantity = Number(notaCreditoDetalle.cantidadUnidades);
        const lineExtensionAmount = this.round2(Number(notaCreditoDetalle.precioTotalSinImpuestos));
        
        // Recalcular siempre el precio unitario para garantizar consistencia con el total
        let priceAmount = 0;
        if (quantity !== 0) {
             priceAmount = lineExtensionAmount / quantity;
             priceAmount = this.round6(priceAmount);
        }

      invoiceLines.push({
        unit_measure_id: unitMeasureId,
        invoiced_quantity: quantity,
        line_extension_amount: lineExtensionAmount,
        tax_totals: taxes,
        description: notaCreditoDetalle.descripcion,
        code: notaCreditoDetalle.codigoProducto,
        type_item_identification_id: typeItemIdentificationId,
        price_amount: priceAmount,
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
