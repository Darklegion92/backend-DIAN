import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DocumentProcessorPort } from '@/document/application/ports/input/document-processor.port';
import { SendDocumentElectronicDto } from '@/document/presentation/dtos/document.dto';
import { SendDocumentElectronicResponse } from '@/document/domain/interfaces/document.interface';
import { InvoiceRequestDto } from '@/invoice/domain/interfaces/invoice-request.interface';
import { AllowanceChargeDto, EmailCcDto, LegalMonetaryTotalsDto, LineDto, PaymentFormDto, SellerOrCustomerDto, TaxTotalDto } from '@/common/domain/interfaces/document-common.interface';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { DatabaseUtilsService } from '@/common/infrastructure/services/database-utils.service';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { InvoiceResponseDto } from '@/invoice/domain/interfaces/invoice-response.interface';
import { HttpService } from '@nestjs/axios';
import { CompanyService } from '@/company/application/services/company.service';
import { CompanyWithCertificateDto } from '@/company/presentation/dtos/company-with-certificate.dto';

/**
 * Caso de uso para procesar facturas electrónicas (Tipo 1)
 * Implementa la interfaz DocumentProcessorPort
 */
@Injectable()
export class ProcessInvoiceUseCase implements DocumentProcessorPort {
  private readonly logger = new Logger(ProcessInvoiceUseCase.name);
  private readonly externalApiUrl: string;

  constructor(
    private readonly generateDataService: GenerateDataService,
    private readonly databaseUtils: DatabaseUtilsService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly companyService: CompanyService
  ) {

    this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
    if (!this.externalApiUrl) {
      throw new Error('EXTERNAL_SERVER_URL no está configurada en las variables de entorno');
    }
  }

  /**
   * Procesa una factura electrónica
   * @param dto - Datos de la factura electrónica
   * @returns Respuesta de la factura electrónica
   */
  async process(dto: SendDocumentElectronicDto): Promise<SendDocumentElectronicResponse> {
    this.logger.log('Iniciando procesamiento de factura electrónica');
    this.logger.debug('Datos de la factura:', {
      number: dto.number,
      nit: dto.nit,
      resolutionNumber: dto.resolutionNumber
    });

    const transformedData = await this.transformInvoiceData(dto);
    try {


      console.log("PDF Document", transformedData);
      const company: CompanyWithCertificateDto = await this.companyService.getCompanyByNit(dto.nit);

      const dianResponse = await this.sendInvoiceToDian(transformedData, company.tokenDian);

      if (dianResponse?.ResponseDian?.Envelope?.Body?.SendBillSyncResponse?.SendBillSyncResult?.IsValid === 'true') {
        const pdfDocument = await this.generateInvoicePdf(dto.nit, dianResponse.urlinvoicepdf, `${transformedData.prefix}${transformedData.number}.pdf`);
        return {
          success: true,
          message: 'Factura electrónica procesada correctamente',
          data: {
            cufe: dianResponse.cufe,
            date: this.generateDataService.formatDateAndTime(new Date()),
            document: pdfDocument
          }
        };
      } else
        if (dianResponse.message === "Este documento ya fue enviado anteriormente, se registra en la base de datos.") {
          return {
            success: true,
            message: 'Factura electrónica procesada correctamente',
            data: {
              cufe: dianResponse.cufe,
              date: this.generateDataService.formatDateAndTime(new Date()),
              document: ""
            }
          };
        } else {
          const errorMessage = dianResponse.ResponseDian.Envelope.Body.SendBillSyncResponse.SendBillSyncResult.ErrorMessage;
          if (errorMessage?.string) {
            return {
              success: false,
              message: errorMessage.string,
              data: {
                cufe: '',
                date: '',
                document: ''
              }
            }
          } else {
            return {
              success: false,
              message: errorMessage.strings.join(', '),
              data: {
                cufe: '',
                date: '',
                document: ''
              }
            }
          }
        }

    } catch (error) {
      this.logger.error('Error al procesar factura electrónica', error);
      return {
        success: false,
        message: `Error al procesar factura electrónica: ${error.message}	${transformedData}`,
        data: {
          cufe: '',
          date: '',
          document: ''
        }
      }
    }
  }

  /**
   * Transforma los datos de la factura electrónica
   * @param dto - Datos de la factura electrónica
   * @returns Datos transformados de la factura
   */
  private async transformInvoiceData({ header, resolutionNumber, number, customer, taxes, detail, payment }: SendDocumentElectronicDto): Promise<any> {

    const dataHead: string[] = header.split('|');

    const prefix: string = dataHead[3].split('-')[0];


    if (resolutionNumber === '18760000001') {
      number = "99" + number.toString().padStart(7, '0');

    }

    const time: string = dataHead[4].split(' ')[1];
    const date: string = dataHead[4].split(' ')[0];

    const dataTrm: string[] = taxes.split('|');
    const dataCustomer: string[] = customer.split('|');
    const dataTaxTotals: string[] = taxes.split('%02G');
    const dataInvoiceLines: string[] = detail.split('0.00¬03');
    const dataPaymentCondition: string[] = payment.split('|');

    const transformedData: InvoiceRequestDto = {
      number: Number(number),
      type_document_id: 1,
      date,
      time,
      resolution_number: resolutionNumber,
      prefix,
      notes: dataTrm.length >= 3 ? dataTrm[3] : '',
      customer: undefined,
      legal_monetary_totals: undefined,
      invoice_lines: []
    }

    const legalMonetaryTotals: LegalMonetaryTotalsDto = {
      line_extension_amount: Number(dataHead[18]),
      tax_exclusive_amount: Number(dataHead[18]),
      tax_inclusive_amount: Number(dataHead[19]),
      payable_amount: Number(dataHead[10])
    };

    const customerDto: SellerOrCustomerDto = await this.generateDataService.getSellerOrCustomerData(dataCustomer);

    if (customerDto.email.includes(';')) {
      const dataEmail: string[] = customerDto.email.split(';');
      customerDto.email = dataEmail[0];

      const emailCc: EmailCcDto[] = [];
      for (let i = 1; i < dataEmail.length; i++) {
        emailCc.push({ email: dataEmail[i] });
      }

      transformedData.email_cc_list = emailCc;
    }

    const taxTotals: TaxTotalDto[] = await this.generateDataService.getTaxTotalsData(dataTaxTotals);
    const invoiceLines: LineDto[] = await this.getInvoiceLinesData(dataInvoiceLines);

    const paymentForm: PaymentFormDto = await this.generateDataService.getPaymentFormData(dataPaymentCondition);

    transformedData.legal_monetary_totals = legalMonetaryTotals;
    transformedData.customer = customerDto;
    transformedData.invoice_lines = invoiceLines;
    transformedData.payment_form = [paymentForm];


    const withHoldingTaxTotal: TaxTotalDto[] = taxTotals.filter(tax => [7, 5, 6].includes(tax.tax_id));

    if (withHoldingTaxTotal.length > 0) {
      transformedData.with_holding_tax_total = withHoldingTaxTotal;
      transformedData.tax_totals = taxTotals.filter(tax => ![7, 5, 6].includes(tax.tax_id));
    } else {
      transformedData.tax_totals = taxTotals;
    }


    return transformedData;

  }

  /**
   * Obtiene los datos de las líneas de la factura
   * @param dataInvoiceLines - Datos de las líneas de la factura
   * @returns Líneas de la factura
   */
  private async getInvoiceLinesData(dataInvoiceLines: string[]): Promise<LineDto[]> {
    const invoiceLines: LineDto[] = [];
    for (const line of dataInvoiceLines) {
      const dataLine: string[] = line.split('|');

      const unitMeasureId: number = await this.databaseUtils.findIdByCode(dataLine[3], 'unit_measures') || 70;

      const taxTotals: TaxTotalDto[] = [];
      const allowanceCharges: AllowanceChargeDto[] = [];

      if (dataLine[45] !== "DESCUENTO ITEM") {
        const taxId: number = await this.databaseUtils.findIdByCode(dataLine[45], 'taxes');
        const taxTotal: TaxTotalDto = {
          tax_id: taxId,
          tax_amount: Number(dataLine[50]),
          percent: Number(dataLine[47]),
          taxable_amount: Number(dataLine[44])
        };
        taxTotals.push(taxTotal);
      } else {
        const discountId: number = await this.databaseUtils.findIdByCode(dataLine[44], 'discounts');

        const allowanceCharge: AllowanceChargeDto = {
          charge_indicator: false,
          allowance_charge_reason: dataLine[45],
          amount: Number(dataLine[47]),
          base_amount: Number(dataLine[48]),
          discount_id: discountId
        };

        allowanceCharges.push(allowanceCharge);
      }

      const typeItemIdentificationId: number = await this.databaseUtils.findIdByCode(dataLine[11], 'type_item_identifications');

      const invoiceLine: LineDto = {
        unit_measure_id: unitMeasureId,
        invoiced_quantity: Number(dataLine[4]),
        line_extension_amount: Number(dataLine[27]),
        tax_totals: taxTotals,
        description: dataLine[9],
        code: dataLine[7],
        type_item_identification_id: typeItemIdentificationId,
        price_amount: Number(dataLine[26]),
        base_quantity: Number(dataLine[2]),
        free_of_charge_indicator: false
      }

      if (dataLine.length > 59) {
        if (dataLine[58] === '02') {
          const taxTotal2: TaxTotalDto = {
            tax_id: 15,
            tax_amount: Number(dataLine[63]),
            percent: Number(dataLine[60]),
            taxable_amount: Number(dataLine[57]),
            tax_name: "Impuesto al tabaco"
          };
          taxTotals.push(taxTotal2);
        }

        if (dataLine[58] === '22') {
          const taxTotal2: TaxTotalDto = {
            tax_id: 10,
            tax_amount: Number(dataLine[63]),
            percent: 0,
            taxable_amount: 0,
            base_unit_measure: 1,
            per_unit_amount: Number(dataLine[62]),
            unit_measure_id: 70,
          };
          taxTotals.push(taxTotal2);

          const allowanceCharges: AllowanceChargeDto[] = [];

          const allowanceCharge: AllowanceChargeDto = {
            charge_indicator: false,
            allowance_charge_reason: "DESCUENTO GENERAL",
            amount: 0,
            base_amount: Number(dataLine[26]),
          };

          allowanceCharges.push(allowanceCharge);

          invoiceLine.allowance_charges = allowanceCharges;
          invoiceLine.free_of_charge_indicator = true;
          invoiceLine.reference_price_id = 3;
          invoiceLine.tax_totals = taxTotals;
          invoiceLine.base_quantity = 1;

        }

      }
      invoiceLines.push(invoiceLine);
    }

    return invoiceLines;
  }

  /**
   * Envía la factura electrónica a la DIAN
   * @param transformedData - Datos transformados de la factura
   * @param token - Token de autenticación
   * @returns Respuesta de la DIAN
   */
  public async sendInvoiceToDian(transformedData: InvoiceRequestDto, token: string): Promise<InvoiceResponseDto> {
    try {
      this.logger.log('Enviando solicitud de factura al servicio externo');
      this.logger.debug('URL del servicio externo:', `${this.externalApiUrl}/invoice`);
      this.logger.debug('Token:', token);

      const response = await firstValueFrom(
        this.httpService.post<InvoiceResponseDto>(
          `${this.externalApiUrl}/invoice`,
          transformedData,
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

      return response.data;
    } catch (error) {
      this.logger.error('Error al consumir el servicio externo de facturas', { error });

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
          case 422:
            throw new HttpException(
              {
                message: 'Datos de factura inválidos, valida el dv del cliente',
                details: error.response.data
              },
              HttpStatus.UNPROCESSABLE_ENTITY
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
   * Genera el PDF de la factura
   * @param dianResponse - Respuesta de la DIAN
   * @param companyDocument - Documento de la empresa
   * @returns PDF en base64
   */
  private async generateInvoicePdf(companyDocument: string, urlinvoicepd: string, name: string): Promise<string> {
    try {
      const documentName = this.generateDataService.buildDocumentName('invoice', urlinvoicepd, name);
      const pdfUrl = `${this.externalApiUrl}/invoice/${companyDocument}/${documentName}`;

      this.logger.debug('Solicitando PDF desde:', pdfUrl);

      const response = await firstValueFrom(
        this.httpService.get(pdfUrl, {
          headers: {
            'Content-Type': 'application/json; utf-8',
            'Accept': 'application/json',
          },
          responseType: 'arraybuffer', // Para recibir datos binarios
          timeout: 30000,
        }),
      );

      // Convertir el ArrayBuffer a base64
      const buffer = Buffer.from(response.data);
      const base64Pdf = buffer.toString('base64');

      this.logger.log('PDF obtenido exitosamente');
      return base64Pdf;

    } catch (error) {
      this.logger.error('Error al obtener PDF:', error);

      return null;
    }
  }
} 
