import { Document } from '@/document/domain/entities/document.entity';
import { DocumentListRequest, SendDocumentElectronicResponse } from '@/document/domain/interfaces/document.interface';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendDocumentElectronicDto } from '../../presentation/dtos/document.dto';
import { DocumentProcessorFactory } from '../../application/services/document-processor.factory';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly documentProcessorFactory: DocumentProcessorFactory,
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

      this.logger.log(`Documentos encontrados: ${total}`);
      this.logger.debug('Primeros documentos:', JSON.stringify(documents.slice(0, 2), null, 2));

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


} 