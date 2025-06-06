import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateInvoiceRequest, CreateInvoiceResponse, InvoiceLineData, PrepareInvoiceData, TaxTotalData, AllowanceChargeData, CustomerData, PaymentFormData } from '../entities/invoice.interface';
import { SendDocumentElectronicResponse } from 'src/document/domain/interfaces/document.interface';
import { CatalogService } from 'src/config/application/services/catalog.service';
import { DocumentRepository } from 'src/document/infrastructure/repositories/document.repository';

@Injectable()
export class ExternalInvoiceService {
  private readonly logger = new Logger(ExternalInvoiceService.name);
  private readonly externalApiUrl: string;

  private withHoldingTaxTotal: TaxTotalData[] = [];

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
   * Crear una factura en el servicio externo Laravel
   */
  async createInvoice(invoiceData: CreateInvoiceRequest, token: string): Promise<CreateInvoiceResponse> {
    try {
      this.logger.log('Enviando solicitud de factura al servicio externo');
      this.logger.debug('URL del servicio externo:', `${this.externalApiUrl}/invoice`);
      this.logger.debug('Datos de la factura:', JSON.stringify(invoiceData, null, 2));

      const response = await firstValueFrom(
        this.httpService.post<CreateInvoiceResponse>(
          `${this.externalApiUrl}/invoice`,
          invoiceData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            timeout: 60000,
          },
        ),
      );

      this.logger.log('Respuesta exitosa del servicio externo');
      this.logger.debug('Respuesta completa:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      this.logger.error('Error al consumir el servicio externo de facturas', {error});
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error en el servicio externo';
        
        this.logger.error(`Error HTTP ${status}: ${message}`);
        
        switch (status) {
          case 400:
            throw new HttpException(
              {
                message: 'Datos de factura inválidos',
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


  async prepareInvoice({token_dian,...invoiceData}: PrepareInvoiceData,  nit: string): Promise<SendDocumentElectronicResponse> {
    try {

        const resolutionNumber:string = invoiceData.resolutionNumber;
        const dataInvoice: string[] = invoiceData.header.split("\|");

        const prefix:string = dataInvoice[3].split("\-")[0];
        let number:string = dataInvoice[2].replace(prefix, "");

        if(resolutionNumber === "18760000001"){
            number = "99" + number.padStart(7, '0');
        }

        const time:string = dataInvoice[4].split(" ")[1];
        const date:string = dataInvoice[4].split(" ")[0];

        const dataDetail:string[] = invoiceData.detail.split("0.00\¬03");
        const dataCustomer:string[] = invoiceData.customer.split("\|");
        const dataTaxes:string[] = invoiceData.taxes.split("\%02G");
        const dataPago:string[] = invoiceData.payment.split("\|");  


        const invoiceLineData: InvoiceLineData[] = await this.createInvoiceLineData(dataDetail);

        const customer: CustomerData = await this.createInvoiceCustomer(dataCustomer);

        const taxes: TaxTotalData[] = await this.createInvoiceTaxes(dataTaxes);

        const payments: PaymentFormData[] = await this.createInvoicePayment(dataPago);
        
        let withHoldingTaxTotal;

        if(this.withHoldingTaxTotal.length > 0){
          withHoldingTaxTotal = this.withHoldingTaxTotal;
          this.withHoldingTaxTotal = [];
        }


        const invoice: CreateInvoiceRequest = {
          number: parseInt(number),
          type_document_id: 1,
          date,
          time,
          resolution_number: resolutionNumber,
          prefix,
          legal_monetary_totals: {
            line_extension_amount: parseFloat(dataInvoice[9]),
            tax_exclusive_amount: parseFloat(dataInvoice[9]),
            tax_inclusive_amount: parseFloat(dataInvoice[10]),
            payable_amount: parseFloat(dataInvoice[10]),
          },
          invoice_lines: invoiceLineData,
          customer: customer,
          tax_totals: taxes,
          payment_form: payments,
          with_holding_tax_total: withHoldingTaxTotal,
        }

        const response: CreateInvoiceResponse = await this.createInvoice(invoice, token_dian);

        return this.evaluateInvoiceResponse(response, prefix, number, token_dian, nit);


    }catch(error){
      this.logger.error('Error al preparar la factura', error);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Crear los datos de la linea de detalle de la factura
   * @param dataDetail - Datos de la linea de detalle de la factura
   * @returns Datos de la linea de detalle de la factura
   */
  private async createInvoiceLineData(dataDetail: string[]): Promise<InvoiceLineData[]> {
    const invoiceLineData: InvoiceLineData[] = [];
    for (const detail of dataDetail) {
      //Separa cada una de las lineas de detalle
      const dataDetailLine: string[] = detail.split("\|");
        //Separa cada uno de los datos de cada linea de detalle

        const unitMeasureId: number  = await this.catalogService.getUnitMeasureIdByCode(dataDetailLine[3]);

        const taxTotals: TaxTotalData[] = [];
        const taxId:number = await this.catalogService.getTaxIdByCode(dataDetailLine[45]);
        const taxTotal: TaxTotalData = {
          tax_id: taxId,
          tax_amount: parseFloat(dataDetailLine[50]),
          percent: parseFloat(dataDetailLine[47]),
          taxable_amount: parseFloat(dataDetailLine[44]),
        };
        taxTotals.push(taxTotal);

        const typeItemIdentificationId: number = await this.catalogService.getTypeItemIdentificationIdByCode(dataDetailLine[11]);

        
        const invoiceLine: InvoiceLineData = {
          unit_measure_id: unitMeasureId,
          invoiced_quantity: parseFloat(dataDetailLine[4]),
          line_extension_amount: parseFloat(dataDetailLine[27]),
          tax_totals: taxTotals,
          description: dataDetailLine[9],
          code: dataDetailLine[7],
          type_item_identification_id: typeItemIdentificationId,
          price_amount: parseFloat(dataDetailLine[26]),
          base_quantity: parseFloat(dataDetailLine[2]),
          free_of_charge_indicator: true,
          reference_price_id: 3,
        };

        if (dataDetailLine.length > 59) {
          if (dataDetailLine[58] === "02" ) {

              const taxTotal2:TaxTotalData = {
                tax_id: 15,
                tax_amount: parseFloat(dataDetailLine[63]),
                percent: parseFloat(dataDetailLine[60]),
                taxable_amount: parseFloat(dataDetailLine[57]),
              };
              taxTotals.push(taxTotal2);
          }

          if (dataDetailLine[58] === "22") {
              const taxTotal2: TaxTotalData = {
                tax_id: 10,
                tax_amount: parseFloat(dataDetailLine[63]),
                percent: 0,
                taxable_amount: 0,
                base_unit_measure: 1,
                per_unit_amount: parseFloat(dataDetailLine[62]),
                unit_measure_id: 70,
              };
              taxTotals.push(taxTotal2);

              const allowanceCharges: AllowanceChargeData[] = [];

              const allowanceCharge: AllowanceChargeData = {
                allowance_charge_reason: "DESCUENTO GENERAL",
                amount: 0,
                base_amount: parseFloat(dataDetailLine[26]),
              };
              allowanceCharges.push(allowanceCharge);

              invoiceLine.allowance_charges = allowanceCharges;
              invoiceLine.free_of_charge_indicator = true;
              invoiceLine.reference_price_id = 3;
              invoiceLine.tax_totals = taxTotals;
              invoiceLine.base_quantity = 1;
          }
      }




        invoiceLineData.push(invoiceLine);

      
    }
    return invoiceLineData;
  }

  /**
   * Crear los datos del cliente de la factura
   * @param dataCustomer - Datos del cliente de la factura
   * @returns Datos del cliente de la factura
   */
  private async createInvoiceCustomer(dataCustomer: string[]): Promise<CustomerData> {



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

    const customer: CustomerData = {
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
   * Crear los datos de los impuestos de la factura
   * @param dataTaxes - Datos de los impuestos de la factura
   * @returns Datos de los impuestos de la factura
   */
  private async createInvoiceTaxes(dataTaxes: string[]): Promise<TaxTotalData[]> {
    const taxes: TaxTotalData[] = [];

    for (const tax of dataTaxes) {

      const dataTax:string[] = tax.split("\|");

      const taxId:number = await this.catalogService.getTaxIdByCode(dataTax[2]);

      let taxTotal: TaxTotalData = {
        tax_id: taxId,
        tax_amount: parseFloat(dataTax[7]),
        percent: parseFloat(dataTax[4]),
        taxable_amount: parseFloat(dataTax[1]),
      };

      if (taxId === 2) {
        taxTotal.tax_id = 15;
        taxTotal.tax_name = "Impuesto";
      }

      if (taxId === 10) {
       taxTotal = {
        tax_id: 10,
        tax_amount: parseFloat(dataTax[7]),
        percent: 0,
        taxable_amount: parseFloat(dataTax[1]),
        base_unit_measure: 1,
        per_unit_amount: parseFloat(dataTax[6]),
        unit_measure_id: 70,
       }
      } 
      if (taxId === 7) {
        this.withHoldingTaxTotal.push(taxTotal);
      }else{
        taxes.push(taxTotal);
      }

    }
    return taxes;
  }

  /**
   * Crear los datos de los medios de pago de la factura
   * @param dataPago - Datos de los medios de pago de la factura
   * @returns Datos de los medios de pago de la factura
   */
  private async createInvoicePayment(dataPago: string[]): Promise<PaymentFormData[]> {
    const payments: PaymentFormData[] = [];

    const paymentFormId:number = await this.catalogService.getPaymentFormIdByCode(dataPago[6]);
    const paymentMethodId:number = await this.catalogService.getPaymentMethodIdByCode(dataPago[5]);

    if (paymentFormId === 2) {
      const paymentDate: Date = new Date();
      const paymentDatePlusEightDays: Date = new Date(paymentDate.getTime() + 8 * 24 * 60 * 60 * 1000);
      const paymentDatePlusEightDaysString: string = paymentDatePlusEightDays.toISOString().split("T")[0];
      payments.push({
        payment_form_id: paymentFormId,
        payment_method_id: paymentMethodId,
        payment_due_date: paymentDatePlusEightDaysString,
        duration_measure: 8,
      });
    }else{
      payments.push({
        payment_form_id: paymentFormId,
        payment_method_id: paymentMethodId,
        payment_due_date: dataPago[4],
        duration_measure: parseInt(dataPago[9]),
      });
    }

    return payments;
  }

  private async evaluateInvoiceResponse(response: CreateInvoiceResponse, prefix: string, number: string, token: string, nit: string): Promise<SendDocumentElectronicResponse> {

    if(response.data?.ResponseDian){
      if(response.data.ResponseDian.Envelope.Body.SendBillSyncResponse.SendBillSyncResult.IsValid === "true"){

        const document: string = await this.getDocumentPDF(nit, prefix, number, token);
        return {
          success: true,
          message: "Factura registrada correctamente",
          data: {
            date: new Date().toISOString(),
            cufe: response.data.cufe,
            document: document,
          }
        }
      }else{

          const errorMessage = response.data.ResponseDian.Envelope.Body.SendBillSyncResponse.SendBillSyncResult.ErrorMessage;

         if(errorMessage.strings.length > 0){
          for (const error of errorMessage.strings) {
            this.logger.error(error);
          }
          throw new HttpException(errorMessage.strings, HttpStatus.INTERNAL_SERVER_ERROR);
         }else{
          throw new HttpException(errorMessage.string, HttpStatus.INTERNAL_SERVER_ERROR);
         }
      }

    } else if(response.cufe){
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
              throw new HttpException("Factura registrada con otro provedor electrónico, agregue el cufe de manera manual", HttpStatus.INTERNAL_SERVER_ERROR);

            
    }

  }

  private async getDocumentPDF(nit: string, prefix: string, number: string, token: string): Promise<string> {
    const url = `${this.externalApiUrl.replace("\/ubl2.1", "")}/invoice/${nit}/FES-${prefix}${number}.pdf`; 
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

    if(response.status === 200){
      const base64Document = Buffer.from(response.data).toString('base64');
      this.logger.debug('Documento convertido a base64');
      return base64Document;
    }else{
      throw new HttpException(response.statusText, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 

