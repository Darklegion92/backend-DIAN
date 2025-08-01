import { Injectable } from "@nestjs/common";
import { DatabaseUtilsService } from "./database-utils.service";
import { AllowanceChargeDto, PaymentFormDto, SellerOrCustomerDto, TaxTotalDto } from "@/common/domain/interfaces/document-common.interface";
import { ClienteDto, FacturaImpuestosDto } from "@/dian-soap/presentation/dtos/request/factura-general.dto";
import { CatalogService } from "@/catalog/application/services/catalog.service";

@Injectable()
export class GenerateDataService {
  constructor(private readonly databaseUtils: DatabaseUtilsService) { }

  /**
    * Obtiene y construye datos de vendedor o cliente
    * Método común reutilizable en todos los módulos
    * 
    * @param data - Array de datos parseados del string
    * @returns SellerOrCustomerDto con los datos estructurados
    */
  async getSellerOrCustomerData(data: string[]): Promise<SellerOrCustomerDto> {
    const typeDocumentIdentificationId: number = await this.databaseUtils.findIdByCode(data[6], 'type_document_identifications');
    const typeLiabilityId: number = await this.databaseUtils.findIdByCode(data[9], 'type_liabilities');
    const typeRegimeId: number = await this.databaseUtils.findIdByCode(data[13], 'type_regimes');

    let codeMunicipality: string = data[66];
    if(codeMunicipality.length === 4){
      codeMunicipality = "0" + codeMunicipality;
    }

    const municipalityId: number = await this.databaseUtils.findIdByCode(codeMunicipality, 'municipalities');

    return {
      identification_number: data[5],
      dv: data[14] || '0',
      name: data[1],
      phone: data[8] || '5777777777',
      email: data[7] || 'sinemail@email.com',
      merchant_registration: data[41] || '00000-0',
      type_document_identification_id: typeDocumentIdentificationId,
      type_organization_id: parseInt(data[2]),
      municipality_id: municipalityId,
      type_liability_id: typeLiabilityId || 117,
      type_regime_id: typeRegimeId || 2,
      postal_zone_code: data[68] || "000000",
      address: data[62] || 'Sin dirección'
    };
  }

  /**
   * Obtiene y construye datos de totales de impuestos del documento
   * Método común reutilizable en todos los módulos
   * 
   * @param data - Array de datos parseados del string
   * @returns TaxTotalDto[] con los datos estructurados
   */
  async getTaxTotalsData(data: string[]): Promise<TaxTotalDto[]> {
    const taxTotals: TaxTotalDto[] = [];

    for (const tax of data) {

      const dataTax: string[] = tax.split('|');

      const taxId: number = await this.databaseUtils.findIdByCode(dataTax[2], 'taxes');


      let taxTotal: TaxTotalDto = {
        tax_id: taxId,
        tax_amount: Number(dataTax[7]),
        percent: Number(dataTax[4]),
        taxable_amount: Number(dataTax[1])
      };

      switch (taxId) {
        case 2:
          taxTotal.tax_name = "Impuesto al tabaco";
          taxTotal.tax_id = 15;
          taxTotals.push(taxTotal);
          break;
        case 10:
          taxTotal = {
            tax_id: 10,
            base_unit_measure: 1,
            per_unit_amount: Number(dataTax[6]),
            unit_measure_id: 70
          }
          taxTotals.push(taxTotal);
          break;
        case 7:
        case 5:
        case 6:
          break;
        default:
          taxTotals.push(taxTotal);
          break;
      }
    }

    return taxTotals;
  }

  /**
   * Formatea una fecha a un formato específico
   * Método común reutilizable en todos los módulos
   * 
   * @param date - Fecha a formatear
   * @returns Fecha formateada en formato yyyy-MM-dd HH:mm:ss
   */
  public formatDateAndTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  /**
   * Formatea una fecha a un formato específico
   * Método común reutilizable en todos los módulos
   * 
   * @param date - Fecha a formatear
   * @returns Fecha formateada en formato yyyy-MM-dd
   */
  public formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }


  /**
   * Obtiene y construye datos de forma de pago del documento
   * Método común reutilizable en todos los módulos
   * 
   * @param data - Array de datos parseados del string
   * @returns PaymentFormDto con los datos estructurados
   */
  public async getPaymentFormData(data: string[]): Promise<PaymentFormDto> {

    const paymentFormId: number = await this.databaseUtils.findIdByCode(data[6], 'payment_forms');
    const paymentMethodId: number = await this.databaseUtils.findIdByCode(data[5], 'payment_methods');

    if (paymentFormId === 2) {
      const fechaHoy = new Date();
      const fechaMasOchoDias = new Date(fechaHoy.getTime() + (8 * 24 * 60 * 60 * 1000));
      const formato = fechaMasOchoDias.toISOString().split('T')[0]; // Formato yyyy-MM-dd

      return {
        payment_form_id: paymentFormId,
        payment_method_id: paymentMethodId,
        payment_due_date: formato,
        duration_measure: 8
      };
    }


    return {
      payment_form_id: paymentFormId,
      payment_method_id: paymentMethodId,
      payment_due_date: data[4],
      duration_measure: Number(data[9])
    };

  }

  /**
   * Construye el nombre del documento basado en el tipo
   * Método común reutilizable en todos los módulos
   * 
   * @param typeDocument - Tipo de documento ('invoice', 'credit-note', etc.)
   * @param urlinvoicepdf - URL del PDF de la respuesta DIAN (ej: "FES-123.pdf")
   * @returns Nombre del documento formateado
   */
  public buildDocumentName(typeDocument: string, urlinvoicepdf: string, name?: string): string {
    let documentPrefix = '';

    switch (typeDocument) {
      case 'invoice':
        documentPrefix = 'FES-';
        break;
      case 'credit-note':
        documentPrefix = 'NCS-';
        break;
      default:
        documentPrefix = 'DOC-';
        break;
    }

    const pdfFileName = urlinvoicepdf || `${documentPrefix}${name}`;
    
    return pdfFileName;
  }

  /**
   * Valida si el correo electrónico y el número de identificación son válidos
   * @param customer - Cliente de la factura
   * @returns boolean - true si el correo electrónico y el número de identificación son válidos, false en caso contrario
   */
  sendEmail(email: string, identificationNumber: string, code?: string): boolean {


    if (code === "11") {
      return false
    }

    if (!email) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }

    const repeatedDigitsRegex = /(\d)\1{4,}/;
    if (repeatedDigitsRegex.test(identificationNumber)) {
      return false;
    }

    return true;

  }

  getNumberAndPrefixString(text: string): { number: number, prefix: string } {
    const match = text.match(/\d+$/);
    let number = match ? Number(match[0]) : 0;
    const prefix = text.replace(number.toString(), "");
    return { number, prefix };
  }

    /**
   * Genera el cliente de la factura
   * @param cliente - Cliente de la factura
   * @returns SellerOrCustomerDto - Cliente de la factura
   */
    async generateCustomer(cliente: ClienteDto, catalogService: CatalogService): Promise<SellerOrCustomerDto> {
      const typeDocumentIdentificationId = await catalogService.getDocumentTypeIdByCode(cliente.tipoIdentificacion);
      const municipalityId = await catalogService.getMunicipalityIdByCode(cliente.direccionCliente.municipio);
      const typeLiabilityId = await catalogService.getLiabilityTypeIdByCode(cliente.responsabilidadesRut.Obligaciones.obligaciones);
      const typeRegimeId = await catalogService.getRegimeTypeIdByCode(cliente.responsabilidadesRut.Obligaciones.regimen);


      try{
        parseInt(cliente.numeroIdentificacionDV);
      }catch(error){
        throw new Error(`El digito de verificación ${cliente.numeroIdentificacionDV} no es un número`);
      }
      
  
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
   * Genera los impuestos de la factura
   * @param impuestos - Impuestos de la factura
   * @returns TaxTotalDto[] - Impuestos de la factura
   */
  async generateTaxtotals(impuestos: FacturaImpuestosDto | FacturaImpuestosDto[], catalogService: CatalogService, quantity?: number): Promise<{ taxes: TaxTotalDto[], allowance_charges: AllowanceChargeDto[], with_holding_taxes: TaxTotalDto[] }> {
    const taxTotals: TaxTotalDto[] = [];
    const allowance_charges: AllowanceChargeDto[] = [];
    const withholding_taxes: TaxTotalDto[] = [];
    if (typeof impuestos === "string") {
      return { taxes: taxTotals, allowance_charges: allowance_charges, with_holding_taxes: withholding_taxes };
    }

    if (Array.isArray(impuestos)) {
      for (const impuesto of impuestos) {
        const taxtId = await catalogService.getTaxIdByCode(impuesto.codigoTOTALImp);
        const unitMeasureId = await catalogService.getUnitMeasureIdByCode(impuesto.unidadMedida);
        if (taxtId === 10) {
          taxTotals.push({
            tax_id: taxtId,
            unit_measure_id: 70,
            tax_amount: Number(impuesto.valorTOTALImp),
            taxable_amount: 0,
            percent: 0,
            per_unit_amount: Number(impuesto.valorTributoUnidad),
            base_unit_measure: 1,
          });

          allowance_charges.push({
            charge_indicator: false,
            allowance_charge_reason: "DESCUENTO GENERAL",
            amount: 0,
            base_amount: Number(impuesto.valorTOTALImp),
          });

        } else if ([5, 6, 7].includes(taxtId)) {
          withholding_taxes.push({
            tax_id: taxtId,
            tax_amount: Number(impuesto.valorTOTALImp),
            percent: Number(impuesto.porcentajeTOTALImp),
            taxable_amount: Number(impuesto.baseImponibleTOTALImp),
            unit_measure_id: unitMeasureId,
          });

        } else if(taxtId === 2){
          taxTotals.push({
            tax_id: taxtId,
            tax_amount: Number(impuesto.valorTOTALImp),
            percent: Number(impuesto.porcentajeTOTALImp),
            taxable_amount: quantity ? Number(impuesto.valorTOTALImp) : Number(impuesto.baseImponibleTOTALImp),
            unit_measure_id: unitMeasureId,
            per_unit_amount: quantity ? Number(impuesto.valorTributoUnidad) : undefined,
            base_unit_measure: quantity,
          });

        }else{
          taxTotals.push({
            tax_id: taxtId,
            tax_amount: Number(impuesto.valorTOTALImp),
            percent: Number(impuesto.porcentajeTOTALImp),
            taxable_amount: Number(impuesto.baseImponibleTOTALImp),
            unit_measure_id: unitMeasureId,
          });
        }


      }
    } else {
      const taxtId = await catalogService.getTaxIdByCode(impuestos.codigoTOTALImp);
      const unitMeasureId = await catalogService.getUnitMeasureIdByCode(impuestos.unidadMedida);
      if (taxtId === 10) {
        taxTotals.push({
          tax_id: taxtId,
          unit_measure_id: 70,
          tax_amount: Number(impuestos.valorTOTALImp),
          taxable_amount: 0,
          percent: 0,
          per_unit_amount: Number(impuestos.valorTributoUnidad),
          base_unit_measure: 1,
        });

        allowance_charges.push({
          charge_indicator: false,
          allowance_charge_reason: "DESCUENTO GENERAL",
          amount: 0,
          base_amount: Number(impuestos.baseImponibleTOTALImp),
        });

      } else {
        taxTotals.push({
          tax_id: taxtId,
          tax_amount: Number(impuestos.valorTOTALImp),
          percent: Number(impuestos.porcentajeTOTALImp),
          taxable_amount: Number(impuestos.baseImponibleTOTALImp),
          unit_measure_id: unitMeasureId,
        });
      }
    }
    return { taxes: taxTotals, allowance_charges: allowance_charges, with_holding_taxes: withholding_taxes };
  }

}