import { Injectable } from "@nestjs/common";
import { DatabaseUtilsService } from "./database-utils.service";
import { PaymentFormDto, SellerOrCustomerDto, TaxTotalDto } from "@/common/domain/interfaces/document-common.interface";

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

}