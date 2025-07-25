import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { DocumentProcessorPort } from '@/document/application/ports/input/document-processor.port';
import { SendDocumentElectronicDto } from '@/document/presentation/dtos/document.dto';
import { SendDocumentElectronicResponse } from '@/document/domain/interfaces/document.interface';
import { SdCreditNoteRequestDto, SdCreditNoteResponseDto, SdCreditNoteSuccessResponseDto } from '@/credit-note/domain/interfaces';
import { BillingReferenceDto, LegalMonetaryTotalsDto, LineDto, SellerOrCustomerDto, TaxTotalDto } from '@/common/domain/interfaces/document-common.interface';
import { ProcessCreditNoteUseCase } from './process-credit-note.use-case';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { CompanyService } from '@/company/application/services/company.service';
import { CompanyWithCertificateDto } from '@/company/presentation/dtos/company-with-certificate.dto';


/**
 * Caso de uso para procesar notas crédito de documento soporte (Tipo 13)
 * Implementa la interfaz DocumentProcessorPort
 */
@Injectable()
export class ProcessCreditNoteDocumentSupportUseCase implements DocumentProcessorPort {
  private readonly logger = new Logger(ProcessCreditNoteDocumentSupportUseCase.name);

  private readonly externalApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly processCreditNoteUseCase: ProcessCreditNoteUseCase,
    private readonly generateDataService: GenerateDataService,
    private readonly companyService: CompanyService
  ) { 
    this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
    if (!this.externalApiUrl) {
      throw new Error('EXTERNAL_SERVER_URL no está configurada en las variables de entorno');
    }
  }

  /**
   * Procesa una nota crédito de documento soporte
   */
  async process(dto: SendDocumentElectronicDto): Promise<SendDocumentElectronicResponse> {
    this.logger.log('Iniciando procesamiento de nota crédito de documento soporte');

    try {

      const transformedData: SdCreditNoteRequestDto = await this.transformCreditNoteDocumentSupportData(dto);

      const company: CompanyWithCertificateDto = await this.companyService.getCompanyByNit(dto.nit);

      const dianResponse: SdCreditNoteResponseDto = await this.sendCreditNoteDocumentSupportToDian(transformedData, company.tokenDian);


      // Verificar si la respuesta fue exitosa usando type guard
      if (!this.isSuccessResponse(dianResponse)) {
        throw new HttpException(
          {
            message: 'Error en el procesamiento de la nota crédito de documento soporte',
            details: dianResponse
          },
          HttpStatus.BAD_REQUEST
        );
      }

      const response: SendDocumentElectronicResponse = {
        success: true,
        message: 'Nota crédito de documento soporte procesada correctamente',
        data: {
          cufe: dianResponse.cufe,
          date: this.generateDataService.formatDateAndTime(new Date()),
        }
      };

      this.logger.log('Nota crédito de documento soporte procesada exitosamente');
      this.logger.debug('CUFE generado:', dianResponse.cufe);

      return response;

    } catch (error) {
      this.logger.error('Error al procesar nota crédito de documento soporte', error);
      throw error;
    }
  }

  /**
   * Transforma los datos de la nota crédito de documento soporte
   * @param dto - Datos de la nota crédito de documento soporte
   * @returns Datos transformados para la nota crédito de documento soporte
   */
  private async transformCreditNoteDocumentSupportData({ header, number, resolutionNumber, customer, taxes, detail, paymentCondition }: SendDocumentElectronicDto): Promise<SdCreditNoteRequestDto> {


    // Parsear header
    const dataHead: string[] = header.split('|');

    const prefix: string = dataHead[3].split('-')[0];
    const time: string = dataHead[4].split(' ')[1];
    const date: string = dataHead[4].split(' ')[0];
    const headNote: string = dataHead[23];
    const sendmail: boolean = dataHead[9] === 'SI';


    //Prepared Legal Monetary Totals
    const legalMonetaryTotals: LegalMonetaryTotalsDto = {
      line_extension_amount: Number(dataHead[9]),
      tax_exclusive_amount: Number(dataHead[9]),
      tax_inclusive_amount: Number(dataHead[10]),
      payable_amount: Number(dataHead[10])
    };

    const dataSeller: string[] = customer.split('|');
    const dataTaxTotals: string[] = taxes.split('%02G');
    const dataCreditNoteLines: string[] = detail.split('0.00¬03');
    const dataPaymentCondition: string[] = paymentCondition.split('|');

    //Prepared Seller
    const seller: SellerOrCustomerDto = await this.generateDataService.getSellerOrCustomerData(dataSeller);

    const taxTotals: TaxTotalDto[] = await this.generateDataService.getTaxTotalsData(dataTaxTotals);

    const creditNoteLines: LineDto[] = await this.processCreditNoteUseCase.getCreditNoteLinesData(dataCreditNoteLines);

    const billingReference: BillingReferenceDto = {
      number: dataPaymentCondition[8],
      uuid: dataPaymentCondition[4],
      issue_date: dataPaymentCondition[6]
    };

    const transformedData: SdCreditNoteRequestDto = {
      discrepancyresponsecode: 1,
      prefix,
      number: Number(number),
      type_document_id: 13,
      date,
      time,
      head_note: headNote,
      resolution_number: resolutionNumber,
      sendmail,
      billing_reference: dataPaymentCondition.length > 7 ? billingReference : undefined,
      legal_monetary_totals: legalMonetaryTotals,
      seller: seller,
      tax_totals: taxTotals,
      credit_note_lines: creditNoteLines,
      discrepancyresponsedescription: detail.split('|')[9],

    };

    if (transformedData.legal_monetary_totals.payable_amount === transformedData.legal_monetary_totals.tax_exclusive_amount) {

      let taxAmount: number = 0.0;

      for (const taxTotal of transformedData.tax_totals) {
        taxAmount += Number(taxTotal.tax_amount);
      }

      const taxExclusiveAmount: number = Number(transformedData.legal_monetary_totals.payable_amount) - taxAmount;

      transformedData.legal_monetary_totals.tax_exclusive_amount = taxExclusiveAmount;
      transformedData.legal_monetary_totals.line_extension_amount = taxExclusiveAmount;

    }
    return transformedData;
  }

 /**
  * Envia la nota crédito de documento soporte al servicio externo
  * @param transformedData - Datos transformados para la nota crédito de documento soporte
  * @returns Respuesta de la nota crédito de documento soporte
  */
  private async sendCreditNoteDocumentSupportToDian(transformedData: SdCreditNoteRequestDto, token: string ): Promise<SdCreditNoteResponseDto> {
    try {
      this.logger.log('Enviando nota crédito de documento soporte al servicio PHP');
      this.logger.debug('URL del servicio externo:', `${this.externalApiUrl}/sd-credit-note`);

      const response = await firstValueFrom(
        this.httpService.post<SdCreditNoteResponseDto>(
          `${this.externalApiUrl}/sd-credit-note`,
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
  private isSuccessResponse(response: SdCreditNoteResponseDto): response is SdCreditNoteSuccessResponseDto {
    if(response?.ResponseDian?.Envelope.Body.SendBillSyncResponse.SendBillSyncResult.IsValid === 'true'){
      return true;
    }

    return false;
  }
    
} 