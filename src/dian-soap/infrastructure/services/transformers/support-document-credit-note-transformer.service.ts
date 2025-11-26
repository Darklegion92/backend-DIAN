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
    
    // Si totalTaxes es 0, entonces tax_exclusive = tax_inclusive = payable = lineExtensionAmount
    // Si hay impuestos, sumarlos.
    
    // Función helper para redondear a 2 decimales y evitar problemas de punto flotante
    const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

    let taxExclusiveAmount = round2(lineExtensionAmount);
    let taxInclusiveAmount = round2(lineExtensionAmount);
    let payableAmount = round2(lineExtensionAmount);
    
    // Si hay impuestos, recalcular con impuestos
    if (taxes.length > 0) {
        // Nota: Aquí asumimos que 'taxes' ya trae los montos correctos. 
        // Si hay inconsistencia global, deberíamos recalcular los impuestos basados en lineExtensionAmount?
        // Por ahora, confiamos en lineExtensionAmount como la base real.
        
        // Si los impuestos son 0 (como en el ejemplo), no suman nada.
         const taxAmountTotal = taxes.reduce((acc, t) => acc + Number(t.tax_amount), 0);
         taxInclusiveAmount = round2(taxExclusiveAmount + taxAmountTotal);
         payableAmount = taxInclusiveAmount;
    }
    
    // Comparar con el total de factura original por si hay cargos globales
    // Si la diferencia es pequeña (redondeo), usamos el calculado. 
    // Si hay cargos globales (no en linea), deberíamos sumarlos.
    
    const legalMonetaryTotals: LegalMonetaryTotalsDto = {
      line_extension_amount: round2(lineExtensionAmount),
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
        const lineExtensionAmount = Number(detalle.precioTotalSinImpuestos);
        
        // Intentar usar el precio unitario provisto si es consistente
        let priceAmount = Number(detalle.precioVentaUnitario);
        
        // Verificar consistencia: Precio * Cantidad ~= Total (tolerancia 0.01)
        if (Math.abs(priceAmount * quantity - lineExtensionAmount) > 0.01) {
           // Si hay discrepancia significativa, recalcular
           if (quantity !== 0) {
             priceAmount = lineExtensionAmount / quantity;
             // Redondear a 6 decimales para evitar ruido de punto flotante (ej. 14416.660000000002 -> 14416.660000)
             priceAmount = Number(priceAmount.toFixed(6));
           } else {
             priceAmount = 0;
           }
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
        const lineExtensionAmount = Number(notaCreditoDetalle.precioTotalSinImpuestos);
        
        // Intentar usar el precio unitario provisto si es consistente
        let priceAmount = Number(notaCreditoDetalle.precioVentaUnitario);
        
        // Verificar consistencia: Precio * Cantidad ~= Total (tolerancia 0.01)
        if (Math.abs(priceAmount * quantity - lineExtensionAmount) > 0.01) {
           // Si hay discrepancia significativa, recalcular
           if (quantity !== 0) {
             priceAmount = lineExtensionAmount / quantity;
             // Redondear a 6 decimales para evitar ruido de punto flotante
             priceAmount = Number(priceAmount.toFixed(6));
           } else {
             priceAmount = 0;
           }
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
