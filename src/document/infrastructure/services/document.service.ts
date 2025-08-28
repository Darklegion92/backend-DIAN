import { Document } from '@/document/domain/entities/document.entity';
import { DocumentListRequest, SendDocumentElectronicResponse } from '@/document/domain/interfaces/document.interface';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DownloadPDFDto, SendDocumentElectronicDto, SendEmailDto } from '../../presentation/dtos/document.dto';
import { DocumentProcessorFactory } from '../../application/services/document-processor.factory';
import { MailService } from '@/common/infrastructure/services/mail.service';
import { User } from '@/auth/domain/entities/user.entity';
import { CompanyService } from '@/company/application/services/company.service';
import { GenerateDataService } from '@/common/infrastructure/services/generate-data.service';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly documentProcessorFactory: DocumentProcessorFactory,
    private readonly mailService: MailService,
    private readonly companyService: CompanyService,
    private readonly generateDataService: GenerateDataService,
  ) {}

  /**
   * Obtener lista de documentos por compañía con paginación y filtros
   * Solo documentos con state_document_id = 1 (Autorizados)
   */
  async getDocuments(filters: DocumentListRequest): Promise<any> {
    try {
      this.logger.log('Obteniendo todos los documentos de la tabla documents');
      this.logger.debug('Filtros aplicados:', JSON.stringify(filters, null, 2));

      // Consulta simple para traer TODOS los campos de la tabla
      const queryBuilder = this.documentRepository.createQueryBuilder('d')
        .where('d.state_document_id = :stateId', { stateId: 1 });

      // Filtros dinámicos
      if (filters.created_at_from) {
        queryBuilder.andWhere('d.created_at >= :createdAtFrom', { createdAtFrom: filters.created_at_from });
      }
      if (filters.created_at_to) {
        queryBuilder.andWhere('d.created_at <= :createdAtTo', { createdAtTo: filters.created_at_to });
      }
      if (filters.prefix) {
        queryBuilder.andWhere('d.prefix = :prefix', { prefix: filters.prefix });
      }
      if (filters.number) {
        queryBuilder.andWhere('d.number = :number', { number: filters.number });
      }
      if (filters.identification_number) {
        queryBuilder.andWhere('d.identification_number = :identificationNumber', { identificationNumber: filters.identification_number });
      }
      if (filters.type_document_id) {
        queryBuilder.andWhere('d.type_document_id = :typeDocumentId', { typeDocumentId: filters.type_document_id });
      }

      // Paginación básica
      const page = filters.page || 1;
      const perPage = filters.per_page || 10;
      const skip = (page - 1) * perPage;

      queryBuilder
        .orderBy('d.created_at', 'DESC')
        .skip(skip)
        .take(perPage);

      const [documents, total] = await queryBuilder.getManyAndCount();

      // Respuesta simple con los datos tal como están en la BD
      const response = {
        success: true,
        message: "Documentos obtenidos exitosamente",
        data: {
          current_page: page,
          per_page: perPage,
          total: total,
          documents: documents, // Los datos tal como están en la BD
          from: documents.length > 0 ? skip + 1 : 0,
          to: documents.length > 0 ? skip + documents.length : 0,
          last_page: Math.ceil(total / perPage)
        }
      };

      return response;

    } catch (error) {
      this.logger.error('Error al obtener documentos de la base de datos', error);
      
      throw new HttpException(
        {
          message: 'Error al consultar documentos',
          details: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Enviar documento electrónico a la DIAN
   * Actúa como orchestrador delegando a los casos de uso específicos
   */
  async sendDocumentElectronic(sendDocumentElectronicDto: SendDocumentElectronicDto): Promise<SendDocumentElectronicResponse> {
    try {
      const documentType = sendDocumentElectronicDto.typeDocumentId;
      const documentTypeLabel = this.documentProcessorFactory.getDocumentTypeName(documentType);
      
      this.logger.log(`🚀 Iniciando procesamiento de documento electrónico: ${documentTypeLabel}`);
      this.logger.debug('📄 Datos del documento:', {
        number: sendDocumentElectronicDto.number,
        typeDocumentId: sendDocumentElectronicDto.typeDocumentId,
        typeLabel: documentTypeLabel,
        nit: sendDocumentElectronicDto.nit,
        resolutionNumber: sendDocumentElectronicDto.resolutionNumber
      });

      // Obtener el procesador específico para el tipo de documento
      const processor = this.documentProcessorFactory.getProcessor(documentType);
      
      // Delegar el procesamiento al caso de uso específico
      const result = await processor.process(sendDocumentElectronicDto);

      this.logger.log(`✅ Documento electrónico ${documentTypeLabel} procesado exitosamente`);
      this.logger.debug('📋 Resultado:', {
        success: result.success,
        cufe: result.data.cufe,
        date: result.data.date
      });

      return result;

    } catch (error) {
      this.logger.error('❌ Error al procesar documento electrónico', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          success: false,
          message: 'Error al procesar el documento',
          error: error.message
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  /**
   * Obtener un documento por su prefix, number y companyIdentification
   * @param prefix - Prefijo del documento
   * @param number - Número del documento
   * @param companyIdentification - Identificación de la compañía
   * @returns Documento encontrado o null si no existe
   */
  async getDocument(prefix:string, number:string, companyIdentification:string){

    return await this.documentRepository.findOne({
      where: {
        prefix,
        number,
        identificationNumber: companyIdentification,
        stateDocumentId: 1
      }
    });
  }

  async sendEmail({number, prefix, correo, document_company}: SendEmailDto, user:User): Promise<any> {

    try {

      const company = await this.companyService.getCompanyByNit(document_company);

      const document = await this.getDocument(prefix, number.toString(), document_company);

      if(!document){
        throw new HttpException({
          success: false,
          message: 'Documento no encontrado',
        }, HttpStatus.NOT_FOUND);
      }

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
            <p><strong>Generado por:</strong> ${company.mailFromName}</p>
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

    const email_cc_list = !!correo ? [{email: correo}] : null;

      const sendEmail = await this.mailService.sendMailWithCompanyConfig({
        prefix,
        number: number.toString(),
        token: company.tokenDian,
        email_cc_list,
        html_body: body,  
      });

      console.log("sendEmail", sendEmail);


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
      return {
        codigo: 500,
        mensaje: error.message,
        resultado: 'Error',
      };
    }
  }


  async downloadPDF({prefix, number, company_document}: DownloadPDFDto): Promise<Buffer> {
    const company = await this.companyService.getCompanyByNit(company_document);
    const document = await this.getDocument(prefix, number.toString(), company_document);

    const pdf = await this.generateDataService.getDocument(prefix, number.toString(), company.identificationNumber, document.typeDocumentId);

    if (!pdf || pdf.length === 0) {
      throw new HttpException({
        success: false,
        message: 'No se pudo obtener el documento PDF',
      }, HttpStatus.NOT_FOUND);
    }
    
    return pdf;
  }

  async deleteDocument(prefix:string, number:string, companyIdentification:string){
    await this.documentRepository.delete({
      prefix,
      number,
      identificationNumber: companyIdentification,
    });
  }

} 