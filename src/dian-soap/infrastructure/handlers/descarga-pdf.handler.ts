import { Injectable } from '@nestjs/common';
import { soapLogger } from '../services/logger.service';
import { DocumentService } from '@/document/infrastructure/services/document.service';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { CompanyService } from '@/company/application/services/company.service';
import { Document } from '@/document/domain/entities/document.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

interface IDescargaPDFRequest {
  tokenEmpresa: string;
  tokenPassword?: string; 
  documento: string;
}

interface IDescargaPDFResponse {
    DescargaPDFResult: {
        codigo: number;
        cufe: string;
        documento: string;
        hash: string;
        mensaje: string;
        resultado: string;
    };
}

@Injectable()
export class DescargaPdfHandler {
  private readonly externalApiUrl: string;
  constructor(
    private readonly documentService: DocumentService,
    private readonly generateDataService: GenerateDataService,
    private readonly companyService: CompanyService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
  }

  async handle(args: IDescargaPDFRequest): Promise<IDescargaPDFResponse> {
    const requestId = Date.now().toString();
    soapLogger.info('Recibida solicitud DescargaPDF', {
      requestId,
      args: JSON.stringify(args),
    });

    try {
      const { tokenEmpresa, tokenPassword, documento } = args;

      if (!tokenEmpresa || !tokenPassword || !documento) {
        throw new Error('Faltan datos requeridos: tokenEmpresa, tokenPassword o documento');
      }

      const company = await this.companyService.getCompanyByTokenEmpresa(tokenEmpresa);

      if (!company || company.tokenPassword !== tokenPassword) {
        return {
          DescargaPDFResult: {
            codigo: 401,
            cufe: '',
            documento: '',
            hash: '',
            mensaje: 'Token o contraseña incorrectos',
            resultado: 'Error',
          },
        };
      }
      let { number, prefix } = this.generateDataService.getNumberAndPrefixString(documento);

      if (prefix === 'SETP') {
        number = number + 990080000;
      }

      const doc: Document = await this.documentService.getDocument(prefix, number.toString(), company.identificationNumber);

      if (!doc || !doc.pdf) {
        return {
          DescargaPDFResult: {
            codigo: 404,
            cufe: '',
            documento: '',
            hash: '',
            mensaje: 'Documento no encontrado o sin PDF adjunto.',
            resultado: 'Error',
          },
        };
      }

      const pdfBase64 = await this.getDocument(prefix, number.toString(), company.identificationNumber);

      const hash = crypto.createHash('sha1').update(pdfBase64).digest('hex'); 
      return {
        DescargaPDFResult: {
          codigo: 200,
          cufe: "",
          documento: pdfBase64,
          hash: "",
          mensaje: 'Documento encontrado y procesado correctamente.',
          resultado: 'Procesado',
        },
      };
    } catch (error) {
      soapLogger.error('Error en DescargaPDF', {
        requestId,
        error: error.message,
        stack: error.stack,
      });

      return {
        DescargaPDFResult: {
          codigo: 500,
          cufe: '',
          documento: '',
          hash: '',
          mensaje: error.message,
          resultado: 'Error',
        },
      };
    }
  }

  async getDocument(prefix: string, number: string, company_identification_number: string): Promise<any> {

    const urlMain = this.externalApiUrl.replace('/ubl2.1', '');
    const response = await firstValueFrom(
      this.httpService.get(`${urlMain}/invoice/${company_identification_number}/FES-${prefix}${number}.pdf`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf',
        },
      })
    );
    return response.data;
  }
} 