import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { DocumentProcessorPort } from '@/document/application/ports/input/document-processor.port';
import { SendDocumentElectronicDto } from '@/document/presentation/dtos/document.dto';
import { SendDocumentElectronicResponse } from '@/document/domain/interfaces/document.interface';
import { DatabaseUtilsService } from '@/common/infrastructure/services/database-utils.service';
import { BillingReferenceDto, InvoicePeriodDto, LegalMonetaryTotalsDto, LineDto, SellerOrCustomerDto, TaxTotalDto } from '@/common/domain/interfaces/document-common.interface';
import { CreditNoteRequestDto, CreditNoteResponseDto, CreditNoteSuccessResponseDto } from '@/credit-note/domain/interfaces';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CompanyService } from '@/company/application/services/company.service';
import { CompanyWithCertificateDto } from '@/company/presentation/dtos/company-with-certificate.dto';
import { ConfigService } from '@nestjs/config';

/**
 * Caso de uso para procesar notas crédito (Tipo 4)
 * Implementa la interfaz DocumentProcessorPort
 */
@Injectable()
export class ProcessCreditNoteUseCase implements DocumentProcessorPort {
  private readonly logger = new Logger(ProcessCreditNoteUseCase.name);

  private readonly externalApiUrl: string;

  constructor(
    private readonly databaseUtils: DatabaseUtilsService, 
    private readonly generateDataService: GenerateDataService,
    private readonly httpService: HttpService,
    private readonly companyService: CompanyService,
    private readonly configService: ConfigService

  ) { 
    this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
  }

  /**
   * Procesa una nota crédito
   */
  async process(dto: SendDocumentElectronicDto): Promise<SendDocumentElectronicResponse> {
    this.logger.log('Iniciando procesamiento de nota crédito');

    try {

      const transformedData = await this.transformCreditNoteData(dto);

      const company: CompanyWithCertificateDto = await this.companyService.getCompanyByNit(dto.nit);

      const dianResponse: CreditNoteResponseDto = await this.sendCreditNoteToDian(transformedData, company.tokenDian);

      // Verificar si la respuesta fue exitosa
      if (!this.isSuccessResponse(dianResponse)) {
        throw new HttpException(
          {
            message: 'Error en el procesamiento de la nota crédito',
            details: dianResponse
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const response: SendDocumentElectronicResponse = {
        success: true,
        message: 'Nota crédito procesada correctamente',
        data: {
          cufe: dianResponse.cude,
          date: this.generateDataService.formatDateAndTime(new Date()),
        }
      };

      this.logger.log('Nota crédito procesada exitosamente');
      this.logger.debug('CUFE generado:', dianResponse.cude);

      return response;

    } catch (error) {
      this.logger.error('Error al procesar nota crédito', error);
      throw error;
    }
  }

  /**
   * Transforma los datos de la nota crédito
   * @param dto - Datos de la nota crédito
   * @returns Datos transformados para la nota crédito
   */
  private async transformCreditNoteData({ header, number, resolutionNumber, customer, taxes, detail, paymentCondition }: SendDocumentElectronicDto): Promise<CreditNoteRequestDto> {

    // Parsear header
    const dataHead: string[] = header.split('|');

    const prefix: string = dataHead[3].split('-')[0];
    const time: string = dataHead[4].split(' ')[1];
    const date: string = dataHead[4].split(' ')[0];
    const headNote: string = dataHead[23];
    const sendmail: boolean = dataHead[9] === 'SI';

    const typeOperationId: number = await this.databaseUtils.findIdByCode(dataHead[16], 'type_operations');

    //Prepared Legal Monetary Totals
    const legalMonetaryTotals: LegalMonetaryTotalsDto = {
      line_extension_amount: Number(dataHead[9]),
      tax_exclusive_amount: Number(dataHead[9]),
      tax_inclusive_amount: Number(dataHead[10]),
      payable_amount: Number(dataHead[10])
    };

    const dataCustomer: string[] = customer.split('|');
    const dataTaxTotals: string[] = taxes.split('%02G');
    const dataCreditNoteLines: string[] = detail.split('0.00¬03');
    const dataPaymentCondition: string[] = paymentCondition.split('|');

    const customerDto: SellerOrCustomerDto = await this.generateDataService.getSellerOrCustomerData(dataCustomer);

    const taxTotals: TaxTotalDto[] = await this.generateDataService.getTaxTotalsData(dataTaxTotals);

    const creditNoteLines: LineDto[] = await this.getCreditNoteLinesData(dataCreditNoteLines);

    const billingReference: BillingReferenceDto = {
      number: dataPaymentCondition[8],
      uuid: dataPaymentCondition[4],
      issue_date: dataPaymentCondition[6]
    };

    let invoicePeriod: InvoicePeriodDto;

    if(typeOperationId === 8) {
      invoicePeriod = {
        start_date: date,
        end_date: date,
        start_time: time,
        end_time: time
      };
    }

    const transformedData: CreditNoteRequestDto = {
      discrepancyresponsecode: 1,
      prefix,
      number: Number(number),
      type_document_id: 4,
      date,
      time,
      type_operation_id: typeOperationId,
      head_note: headNote,
      resolution_number: resolutionNumber,
      send_mail: sendmail,
      billing_reference: billingReference,
      legal_monetary_totals: legalMonetaryTotals,
      customer: customerDto,
      tax_totals: taxTotals,
      credit_note_lines: creditNoteLines,
      invoice_period: invoicePeriod
    }


    return transformedData;

  }

  /**
 * Obtiene y construye datos de líneas de nota crédito de documento soporte
 * Método común reutilizable en todos los módulos
 * 
 * @param dataCreditNoteLines - Array de datos parseados del string
 * @returns CreditNoteLineDto[] con los datos estructurados
 */
  public async getCreditNoteLinesData(dataCreditNoteLines: string[]): Promise<LineDto[]> {
    const creditNoteLines: LineDto[] = [];
    for (const line of dataCreditNoteLines) {
      const dataLine: string[] = line.split('|');

      const unitMeasureId: number = await this.databaseUtils.findIdByCode(dataLine[3], 'unit_measures');
      const typeItemIdentificationId: number = await this.databaseUtils.findIdByCode(dataLine[14], 'type_item_identifications');
      const priceAmount: number = Number(dataLine[27]) / Number(dataLine[4]);


      const taxTotals: TaxTotalDto[] = [];;

      const taxId: number = await this.databaseUtils.findIdByCode(dataLine[45], 'taxes');

      const taxTotal: TaxTotalDto = {
        tax_id: taxId,
        tax_amount: Number(dataLine[50]),
        percent: Number(dataLine[47]),
        taxable_amount: Number(dataLine[44])
      };

      taxTotals.push(taxTotal);

      if (dataLine.length > 59 && dataLine[58] === '02') {
        const taxTotal2: TaxTotalDto = {
          tax_id: 15,
          tax_amount: Number(dataLine[63]),
          percent: Number(dataLine[60]),
          taxable_amount: Number(dataLine[57]),
          tax_name: "Impuesto al tabaco"
        };
        taxTotals.push(taxTotal2);
      }

      const creditNoteLine: LineDto = {
        unit_measure_id: unitMeasureId,
        invoiced_quantity: Number(dataLine[4]),
        line_extension_amount: Number(dataLine[27]),
        tax_totals: taxTotals,
        description: dataLine[1],
        code: dataLine[2],
        type_item_identification_id: typeItemIdentificationId,
        price_amount: priceAmount,
        base_quantity: Number(dataLine[2]),
        free_of_charge_indicator: false
      };


      creditNoteLines.push(creditNoteLine);
    }
    return creditNoteLines;
  }

 /**
  * Envia la nota crédito al servicio externo
  * @param transformedData - Datos transformados para la nota crédito
  * @returns Respuesta de la nota crédito
  */
  private async sendCreditNoteToDian(transformedData: CreditNoteRequestDto, token: string): Promise<CreditNoteResponseDto> {
    try {
      this.logger.log('Enviando nota crédito de documento soporte al servicio PHP');
      this.logger.debug('URL del servicio externo:', `${this.externalApiUrl}/sd-credit-note`);

      const response = await firstValueFrom(
        this.httpService.post<CreditNoteResponseDto>(
          `${this.externalApiUrl}/credit-note`,
          transformedData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            timeout: 120000, // 2 minutos para documento soporte
          }
        )
      );

      this.logger.log('Respuesta exitosa del servicio DIAN');
      return response.data;

    } catch (error) {
      this.logger.error('Error al consumir el servicio externo de notas crédito de documento soporte', { error });

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || 'Error en el servicio externo';

        this.logger.error(`Error HTTP ${status}: ${message}`);

        switch (status) {
          case 400:
            throw new HttpException(
              {
                message: 'Datos de nota crédito de documento soporte inválidos',
                details: error.response.data
              },
              HttpStatus.BAD_REQUEST
            );
          case 401:
            throw new HttpException(
              {
                message: 'Error de autenticación con la DIAN',
                details: 'Verifica las credenciales de la DIAN'
              },
              HttpStatus.UNAUTHORIZED
            );
          case 422:
            throw new HttpException(
              {
                message: 'Error de validación de documento soporte',
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
                message: 'Servicio de la DIAN no disponible',
                details: 'El servicio de la DIAN está temporalmente fuera de servicio'
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
   * Type guard para verificar si la respuesta es exitosa
   */
  private isSuccessResponse(response: CreditNoteResponseDto): response is CreditNoteSuccessResponseDto {
    return response.success === true;
  }

} 