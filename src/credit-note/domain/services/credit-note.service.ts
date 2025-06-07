import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { AllowanceCharge, CreditNoteLine, CreditNoteRequest, CreditNoteResponse, Customer, MonetaryTotal, TaxTotal } from "../dto/credit-note-request.interface";
import { ConfigService } from "@nestjs/config";
import { DocumentRepository } from "src/document/infrastructure/repositories/document.repository";
import { CatalogService } from "src/config/application/services/catalog.service";
import { firstValueFrom } from "rxjs";
import { PrepareDocumentData, SendDocumentElectronicResponse } from "src/document/domain/interfaces/document.interface";


@Injectable()
export class CreditNoteService {
  private readonly logger = new Logger(CreditNoteService.name);
  private readonly externalApiUrl: string;


  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly catalogService: CatalogService,
    private readonly documentRepositoryInfrastructure: DocumentRepository,
  ) {
    this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
    if (!this.externalApiUrl) {
      throw new Error('EXTERNAL_SERVER_URL no está configurada en las variables de entorno');
    }
  }

  /**
   * Crea una nota crédito
   * @param creditNote - Datos de la nota crédito
   * @param tokenDian - Token de autenticación
   * @returns Respuesta del servicio externo
   */
  async createCreditNote(creditNote: CreditNoteRequest, token: string): Promise<CreditNoteResponse> {
    try {
      this.logger.log('Enviando solicitud de nota crédito al servicio externo');
      this.logger.debug('URL del servicio externo:', `${this.externalApiUrl}/credit-note`);
      this.logger.debug('Datos de la nota crédito:', JSON.stringify(creditNote, null, 2));

      const response = await firstValueFrom(
        this.httpService.post<CreditNoteResponse>(
          `${this.externalApiUrl}/credit-note`,
          creditNote,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 60000,
          }
        )
      );

      this.logger.log('Respuesta exitosa del servicio externo');
      this.logger.debug('Respuesta completa:', JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      this.logger.error('Error al consumir el servicio externo de notas crédito', { error });

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error en el servicio externo';

        this.logger.error(`Error HTTP ${status}: ${message}`);

        switch (status) {
          case 400:
            throw new HttpException(
              {
                message: 'Datos de nota crédito inválidos',
                details: error.response.data
              },
              HttpStatus.BAD_REQUEST
            );
          case 401:
            throw new HttpException(
              {
                message: 'Token de autenticación inválido',
                details: 'Verifica que el token Bearer sea válido'
              },
              HttpStatus.UNAUTHORIZED
            );
          case 408:
            throw new HttpException(
              {
                message: 'Timeout en el servicio externo',
                details: 'El servicio externo tardó demasiado en responder'
              },
              HttpStatus.REQUEST_TIMEOUT
            );
          case 500:
            throw new HttpException(
              {
                message: 'Error interno del servicio externo',
                details: error.response.data
              },
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          case 503:
            throw new HttpException(
              {
                message: 'Servicio externo no disponible',
                details: 'El servicio externo está temporalmente fuera de servicio'
              },
              HttpStatus.SERVICE_UNAVAILABLE
            );
          default:
            throw new HttpException(
              {
                message: `Error del servicio externo: ${message}`,
                details: error.response.data
              },
              HttpStatus.BAD_GATEWAY
            );
        }
      } else if (error.code === 'ECONNREFUSED') {
        throw new HttpException(
          {
            message: 'No se puede conectar al servicio externo',
            details: `Verifica que el servicio esté ejecutándose en: ${this.externalApiUrl}`
          },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      } else if (error.code === 'ETIMEDOUT') {
        throw new HttpException(
          {
            message: 'Timeout de conexión al servicio externo',
            details: 'El servicio externo no respondió en el tiempo esperado'
          },
          HttpStatus.REQUEST_TIMEOUT
        );
      } else {
        throw new HttpException(
          {
            message: 'Error desconocido al comunicarse con el servicio externo',
            details: error.message
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  /**
   * Prepara los datos de la nota crédito
   * @param creditNote - Datos de la nota crédito
   * @param nit - NIT de la empresa
   * @returns Datos de la nota crédito
   */
  async prepareCreditNote({tokenDian,...creditNote}: PrepareDocumentData, nit: string): Promise<SendDocumentElectronicResponse > {
    try {

      const resolutionNumber:string = creditNote.resolutionNumber;
      const headData: string[] = creditNote.header.split("\|");

      const prefix:string = headData[3].split("\-")[0];
      let number:string = headData[2].replace(prefix, "");


      const time:string = headData[4].split(" ")[1];
      const date:string = headData[4].split(" ")[0];

      const typeOperationId:number = await this.catalogService.getTypeOperationIdByCode(headData[16]);

      const dataDetail:string[] = creditNote.detail.split("0.00\¬03");
      const dataCustomer:string[] = creditNote.customer.split("\|");
      const dataTaxes:string[] = creditNote.taxes.split("\%02G");

      const legalMonetaryTotal: MonetaryTotal = {
        line_extension_amount: parseFloat(headData[9]),
        tax_exclusive_amount: parseFloat(headData[9]),
        tax_inclusive_amount: parseFloat(headData[10]),
        payable_amount: parseFloat(headData[10]),
      };

      const customer: Customer = await this.createCustomer(dataCustomer);
      const taxes: TaxTotal[] = await this.createCreditNoteTaxes(dataTaxes);
      const creditNoteLineData: CreditNoteLine[] = await this.createCreditNoteLineData(dataDetail);

      const creditNotePrepared: CreditNoteRequest = {
        discrepancyresponsecode: 1,
        prefix,
        number,
        type_document_id: 4,
        date,
        time,
        type_operation_id: typeOperationId,
        head_note: customer[23],
        resolution_number: resolutionNumber,
        send_mail: this.validateSendEmail(customer.identification_number, customer.email) && customer[9] === "SI",
        legal_monetary_total: legalMonetaryTotal,
        customer,
        tax_totals: taxes,
        credit_note_lines: creditNoteLineData,
        billing_reference: creditNote.billingReference,
      }

      const response: CreditNoteResponse = await this.createCreditNote(creditNotePrepared, tokenDian);
      return this.evaluateCreditNoteResponse(response, prefix, number, tokenDian, nit);

    } catch (error) {
      this.logger.error('Error al preparar los datos de la nota crédito', {error});
      throw error;
    }
  }

  /**
   * Crear los datos del cliente 
   * @param dataCustomer - Datos del cliente
   * @returns Datos del cliente
   */
  private async createCustomer(dataCustomer: string[]): Promise<Customer> {
    const typeDocumentIdentificationId:number = await this.catalogService.getDocumentTypeIdByCode(dataCustomer[6]);
    const typeLiabilityId:number = await this.catalogService.getLiabilityTypeIdByCode(dataCustomer[44]);
    const typeRegimeId:number = await this.catalogService.getRegimeTypeIdByCode(dataCustomer[45]);
    let codeMunicipality = dataCustomer[66];

    if(codeMunicipality.length === 4){
      codeMunicipality = "0" + codeMunicipality;
    }
    const municipalityId = await this.catalogService.getMunicipalityByCode(codeMunicipality);

    let phone = dataCustomer[8];
    let address = dataCustomer[62];
    let email = dataCustomer[7];
    let dv = dataCustomer[14];

    if (phone === "" || phone === " " || phone === null || phone === undefined) {
      phone = "5781818";
  }

  if (address === "" || address === " " || address === null || address === undefined) {
      address = "Sin Dirección";
  }

  if (email === "" || email === " " || email === null || email === undefined) {
      email = "sinemail@gmail.com";
  }

  if (dv === "" || dv === " " || dv === null || dv === undefined) {
      dv = "0";
  }

    const customer: Customer = {
      identification_number: dataCustomer[5],
      dv: parseInt(dv),
      name: dataCustomer[1],
      phone: phone,
      address: address,
      email: email,
      type_document_identification_id: typeDocumentIdentificationId,
      type_organization_id: parseInt(dataCustomer[2]),
      type_liability_id: typeLiabilityId,
      municipality_id: municipalityId.id,
      type_regime_id: typeRegimeId,
      merchant_registration: dataCustomer[41],
    };
    return customer;
  }

  /**
   * Crear los datos de los impuestos de la nota crédito
   * @param dataTaxes - Datos de los impuestos
   * @returns Datos de los impuestos
   */
private async createCreditNoteTaxes(dataTaxes: string[]): Promise<TaxTotal[]> {
  const taxes: TaxTotal[] = [];
  for (const tax of dataTaxes) {
    const dataTax: string[] = tax.split("\|");

    const taxId: number = await this.catalogService.getTaxIdByCode(dataTax[2]);

    let taxTotal: TaxTotal = {
      tax_id: taxId,
      tax_amount: parseFloat(dataTax[7]),
      percent: parseFloat(dataTax[4]),
      taxable_amount: parseFloat(dataTax[1]),
    };

    switch(taxId){
      case 2:
        taxTotal.tax_name = "Impuesto al tabaco";
        taxTotal.tax_id = 15;
        break;
      case 10:
        taxTotal = {
          tax_id: 10,
          tax_amount: parseFloat(dataTax[7]),
          percent: 0,
          taxable_amount: parseFloat(dataTax[1]),
          base_unit_measure: 1,
          per_unit_amount: parseFloat(dataTax[6]),
          unit_measure_id: 70,
        }
        taxes.push(taxTotal);
        break;
      default:
        taxes.push(taxTotal);
        break;
    }

  }
  return taxes;
}

  /**
   * Crear los datos de las líneas de la nota crédito
   * @param dataDetail - Datos de las líneas
   * @returns Datos de las líneas
   */
  private async createCreditNoteLineData(dataDetail: string[]): Promise<CreditNoteLine[]> {
    const creditNoteLineherData: CreditNoteLine[] = [];
    for (const detail of dataDetail) {
      const dataDetailLine: string[] = detail.split("\|");

      const unitMeasureId: number  = await this.catalogService.getUnitMeasureIdByCode(dataDetailLine[3]);

      const taxTotals: TaxTotal[] = [];
     const allowanceCharges: AllowanceCharge[] = [];

     if(dataDetailLine[46] === "DESCUENTO ITEM"){
      const taxId: number = await this.catalogService.getTaxIdByCode(dataDetailLine[45]);
      const taxTotal: TaxTotal = {
        tax_id: taxId,
        tax_amount: parseFloat(dataDetailLine[50]),
        percent: parseFloat(dataDetailLine[47]),
        taxable_amount: parseFloat(dataDetailLine[44]),
      }
      taxTotals.push(taxTotal);
     }else{
      const taxId: number = await this.catalogService.getTaxIdByCode(dataDetailLine[57]);
      const taxTotal: TaxTotal = {
        tax_id: taxId,
        tax_amount: parseFloat(dataDetailLine[62]),
        percent: parseFloat(dataDetailLine[59]),
        taxable_amount: parseFloat(dataDetailLine[56]),
      }
      taxTotals.push(taxTotal);

      if(dataDetailLine[45] === "Valor adicional"){
        const allowanceCharge: AllowanceCharge = {
          charge_indicator: false,
          allowance_charge_reason: dataDetailLine[45],
          amount: parseFloat(dataDetailLine[47]),
          base_amount: parseFloat(dataDetailLine[48]),
        }

        const discountId: number = await this.catalogService.getDiscountIdByCode(dataDetailLine[44]);
        allowanceCharge.discount_id = discountId;
        allowanceCharges.push(allowanceCharge);
      }


     }


     if(dataDetailLine.length > 59 && dataDetailLine[58] === "02"){
      const taxTotal2: TaxTotal = {
        tax_id: 15,
        tax_amount: parseFloat(dataDetailLine[63]),
        percent: parseFloat(dataDetailLine[60]),
        taxable_amount: parseFloat(dataDetailLine[57]),
        tax_name: "Impuesto al tabaco",
      }
      taxTotals.push(taxTotal2);
     }

     const typeItemIdentificationId: number = await this.catalogService.getTypeItemIdentificationIdByCode(dataDetailLine[11]);

     const creditNoteLine: CreditNoteLine = {
       unit_measure_id: unitMeasureId,
       invoiced_quantity: parseFloat(dataDetailLine[4]),
       line_extension_amount: parseFloat(dataDetailLine[27]),
       tax_totals: taxTotals,
       description: dataDetailLine[9],
       code: dataDetailLine[7],
       type_item_identification_id: typeItemIdentificationId,
       price_amount: parseFloat(dataDetailLine[26]),
       base_quantity: parseFloat(dataDetailLine[2]),
     }


     if(dataDetailLine.length > 59){

      if(dataDetailLine[58] === "02"){
        const taxTotal2: TaxTotal = {
          tax_id: 15,
          tax_amount: parseFloat(dataDetailLine[63]),
          percent: parseFloat(dataDetailLine[60]),
          taxable_amount: parseFloat(dataDetailLine[57]),
          tax_name: "Impuesto",
        }
        taxTotals.push(taxTotal2);
      }

      if(dataDetailLine[58] === "22"){
        const taxTotal2: TaxTotal = {
          tax_id: 10,
          tax_amount: parseFloat(dataDetailLine[63]),
          percent: 0,
          taxable_amount: 0,
          base_unit_measure: 1,
          per_unit_amount: parseFloat(dataDetailLine[62]),
          unit_measure_id: 70,
        }
        taxTotals.push(taxTotal2);

        const allowanceCharge: AllowanceCharge = {
          charge_indicator: false,
          allowance_charge_reason: "DESCUENTO GENERAL",
          amount: 0,
          base_amount: parseFloat(dataDetailLine[26]),
        }
        allowanceCharges.push(allowanceCharge);


        creditNoteLine.allowance_charges = allowanceCharges;
        creditNoteLine.free_of_charge_indicator = true;
        creditNoteLine.reference_price_id=3;
        creditNoteLine.tax_totals = taxTotals;
        creditNoteLine.base_quantity = 1;
      }
     }

      creditNoteLineherData.push(creditNoteLine);
  }
  return creditNoteLineherData;
  }

  /**
   * Validar si el cliente tiene un email válido
   * @param customerIdentification - Identificación del cliente
   * @returns true si el cliente tiene un email válido, false en caso contrario
   */
  private validateSendEmail(customerIdentification: string, email: string): boolean {
   
    if(email === "sinemail@gmail.com"){
      return false;
    }
    return !customerIdentification.match(".*22222.*");
  }

  /**
   * Evaluar la respuesta de la factura
   * @param response - Respuesta de la factura
   * @param prefix - Prefijo de la factura
   * @param number - Número de la factura
   * @param token - Token de autenticación
   * @param nit - NIT de la empresa
   * @returns Respuesta de la factura
   */
  private async evaluateCreditNoteResponse(response: CreditNoteResponse, prefix: string, number: string, token: string, nit: string): Promise<SendDocumentElectronicResponse> {

    if(response.ResponseDian){
      if(response.ResponseDian.Envelope.Body.SendBillSyncResponse.SendBillSyncResult.IsValid === "true"){

        const document: string = await this.getDocumentPDF(nit, prefix, number, token);
        return {
          success: true,
          message: "Factura registrada correctamente",
          data: {
            date: new Date().toISOString(),
            cufe: response.cude,
            document: document,
          }
        }
      }else{

          const errorMessage = response.ResponseDian.Envelope.Body.SendBillSyncResponse.SendBillSyncResult.ErrorMessage;

         if(errorMessage.strings.length > 0){
          for (const error of errorMessage.strings) {
            this.logger.error(error);
          }
          throw new HttpException(errorMessage.strings, HttpStatus.INTERNAL_SERVER_ERROR);
         }else{
          throw new HttpException(errorMessage.string, HttpStatus.INTERNAL_SERVER_ERROR);
         }
      }

    } else if(response.cude){
          const document = await this.documentRepositoryInfrastructure.findOne(prefix, number, nit);
          if(document){

            const documentPdf: string = await this.getDocumentPDF(nit, prefix, number, token);
            return {
              success: true,
              message: "Factura registrada correctamente",
              data: {
                date: new Date().toISOString(),
                cufe: document.cufe,
                document: documentPdf,
              }
            } 
          }
              throw new HttpException("Factura registrada con otro provedor electrónico, agregue el cufe de manera manual", HttpStatus.BAD_REQUEST);
    }

  }

  /**
   * Obtener el documento PDF de la nota crédito
   * @param nit - NIT de la empresa
   * @param prefix - Prefijo de la nota crédito
   * @param number - Número de la nota crédito
   * @param token - Token de autenticación
   * @returns Documento PDF de la nota crédito
   */
  private async getDocumentPDF(nit: string, prefix: string, number: string, token: string): Promise<string> {
    const url = `${this.externalApiUrl.replace("\/ubl2.1", "")}/credit-note/${nit}/NCS-${prefix}${number}.pdf`; 
    this.logger.debug('URL del documento:', url);
    const response = await firstValueFrom(
      this.httpService.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'arraybuffer'
      }),
    );
    return response.data;
  }
}