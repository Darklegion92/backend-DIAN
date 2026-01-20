import { Injectable } from '@nestjs/common';
import { EnvioCorreoRequest } from '../../domain/interfaces/envio-correo-request.interface';
import { EnvioCorreoResponse } from '../../domain/interfaces/envio-correo-response.interface';
import { soapLogger } from '../services/logger.service';
import { DocumentService } from '@/document/infrastructure/services/document.service';
import { CompanyService } from '@/company/application/services/company.service';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';
import { MailService } from '@/common/infrastructure/services/mail.service';
import { Document } from '@/document/domain/entities/document.entity';
import { firstValueFrom } from 'rxjs';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class EnvioCorreoHandler {
  constructor(
    private readonly documentService: DocumentService,
    private readonly companyService: CompanyService,
    private readonly generateDataService: GenerateDataService,
    private readonly mailService: MailService,
  ) { }

  async handle(args: EnvioCorreoRequest): Promise<EnvioCorreoResponse> {
    const requestId = Date.now().toString();
    soapLogger.info('Recibida solicitud EnvioCorreo', {
      requestId,
      args: JSON.stringify(args),
    });

    try {
      const { tokenEmpresa, tokenPassword, documento, correo, adjuntos } = args;

      if (!tokenEmpresa || !tokenPassword || !documento || !adjuntos) {
        throw new Error('Faltan datos requeridos: tokenEmpresa, tokenPassword, documento, correo o adjuntos');
      }

      let { number, prefix } = this.generateDataService.getNumberAndPrefixString(documento);


      const company = await this.companyService.getCompanyByTokenEmpresa(tokenEmpresa);


      if (prefix === "SETP") {
        number = number + 990080000;
      }

      const document = await this.documentService.getDocument(prefix, number.toString(), company.identificationNumber);

      const body = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #e75c0b; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Notificación de Documento Electrónico</h1>
        </div>
        <div style="padding: 25px; background-color: #f9f9f9;">
          <p>Estimado(a) cliente,</p>
          <p>Le informamos que se ha generado un nuevo documento electrónico asociado a su cuenta.</p>
          <div style="background-color: #ffffff; padding: 20px; border-left: 5px solid #f67615; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #f67615;">Detalles del Documento</h3>
            <p><strong>Documento No:</strong> ${document.prefix}${document.number}</p>
            <p><strong>Generado por:</strong> ${company.usuarioDian || company.mailFromName}</p>
            <p><strong>Fecha de Emisión:</strong> ${new Date(document.dateIssue).toLocaleDateString('es-CO')}</p>
          </div>
          <p>Encontrará el archivo adjunto a este correo, el cual contiene la representación gráfica del documento en formato PDF y el archivo XML correspondiente.</p>
          <p>Gracias por su confianza.</p>
          <p>Atentamente,<br/><strong>El equipo de SOLTEC - Tecnología y Desarrollo.</strong></p>
        </div>
        <div style="background-color: #f2f2f2; color: #666; padding: 15px; text-align: center; font-size: 12px;">
          <p>Este es un correo electrónico generado automáticamente. Por favor, no responda a este mensaje.</p>
          <p>&copy; ${new Date().getFullYear()} SOLTEC - Tecnología y Desarrollo. Todos los derechos reservados.</p>
        </div>
      </div>
    `;

      const email_cc_list = !!correo ? [{ email: correo }] : null;
      // Asegura XML antes de solicitar el PDF en el servicio externo
      await regenerateXml(document);
      //Valida y reconstruye el pdf si es necesario
      await this.generateDataService.getDocument(prefix, number.toString(), company.identificationNumber, parseInt(document.typeDocumentId.toString()), document.cufe, company.tokenDian);


      const sendEmail = await this.mailService.sendMailWithCompanyConfig({
        prefix,
        number: number.toString(),
        token: company.tokenDian,
        email_cc_list,
        html_body: body,
      });


      if (sendEmail.success) {
        return {
          codigo: 200,
          mensaje: 'Correo enviado correctamente.',
          resultado: 'Procesado',
        };
      }

      return {
        codigo: 400,
        mensaje: sendEmail.message,
        resultado: 'Error',
      };
    } catch (error) {
      console.log("error", error);
      soapLogger.error('Error en EnvioCorreo', { requestId, error: error.message });
      return {
        codigo: 500,
        mensaje: error.message,
        resultado: 'Error',
      };
    }
  }
}

async function regenerateXml(document: Document) {
  let prefixDocument = "FE";

  switch (document.typeDocumentId) {
    case 1:
      prefixDocument = "FE";
      break;
    case 4:
      prefixDocument = "NC";
      break;
    case 11:
      prefixDocument = "DS";
      break;
  }

  const fileName = `Rpta${prefixDocument}-${document.prefix}${document.number}.xml`;

  const routeXml = `/var/www/html/apidian/storage/app/public/${document.identificationNumber}/${fileName}`;

  try {
    await fs.access(routeXml);
    return;
  } catch {
    const xmlContent = buildXmlFromResponseDian(document.responseDian);
    await fs.mkdir(path.dirname(routeXml), { recursive: true });
    await fs.writeFile(routeXml, xmlContent, 'utf8');
  }
}

function buildXmlFromResponseDian(responseDian: unknown): string {
  if (responseDian === null || responseDian === undefined) {
    return '';
  }

  if (typeof responseDian === 'string') {
    const trimmed = responseDian.trim();
    if (trimmed.startsWith('<')) {
      return trimmed;
    }

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return toXml(parsed);
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  }

  return toXml(responseDian);
}

function toXml(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value !== 'object') {
    return escapeXml(String(value));
  }

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 1) {
    const [rootKey] = keys;
    return `<?xml version="1.0" encoding="utf-8"?>\n${serializeElement(rootKey, obj[rootKey])}`;
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n${keys.map((key) => serializeElement(key, obj[key])).join('')}`;
}

function serializeElement(tag: string, value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((item) => serializeElement(tag, item)).join('');
  }

  if (value === null || value === undefined) {
    return `<${tag}/>`;
  }

  if (typeof value !== 'object') {
    return `<${tag}>${escapeXml(String(value))}</${tag}>`;
  }

  const obj = value as Record<string, unknown>;
  const attributes = obj._attributes && typeof obj._attributes === 'object'
    ? buildAttributes(obj._attributes as Record<string, unknown>)
    : '';

  const textValue = obj._value ?? obj._text;
  const cdataValue = obj._cdata;
  const childrenKeys = Object.keys(obj).filter(
    (key) => !['_attributes', '_value', '_text', '_cdata'].includes(key)
  );

  const childrenContent = childrenKeys.map((key) => serializeElement(key, obj[key])).join('');
  const textContent = textValue !== undefined ? escapeXml(String(textValue)) : '';
  const cdataContent = cdataValue !== undefined ? `<![CDATA[${String(cdataValue)}]]>` : '';
  const content = `${textContent}${cdataContent}${childrenContent}`;

  if (!content) {
    return `<${tag}${attributes}/>`;
  }

  return `<${tag}${attributes}>${content}</${tag}>`;
}

function buildAttributes(attributes: Record<string, unknown>): string {
  const pairs = Object.entries(attributes).map(([key, value]) => {
    return `${key}="${escapeXml(String(value))}"`;
  });

  return pairs.length ? ` ${pairs.join(' ')}` : '';
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
