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
  async getDocuments(filters: DocumentListRequest, companyId: number): Promise<any> {
    try {
      this.logger.log('Obteniendo todos los documentos de la tabla documents');
      this.logger.debug('Filtros aplicados:', JSON.stringify(filters, null, 2));
      this.logger.debug('ID de compañía:', companyId);

      // Consulta simple para traer TODOS los campos de la tabla
      const queryBuilder = this.documentRepository.createQueryBuilder('d')
        .where('d.state_document_id = :stateId', { stateId: 1 })
        .andWhere('d.deleted_at IS NULL'); // Solo documentos no eliminados

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
   * Generar CUFE simulado para pruebas
   */
  private generateSimulatedCufe(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 96; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generar documento PDF simulado en base64
   */
  private generateSimulatedPdfDocument(): string {
    // Documento PDF básico en base64 para pruebas
    return 'JVBERi0xLjcKCjEgMCBvYmoKPDwKL1R5cGUgL0NhdGFsb2cKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoKMiAwIG9iago8PAovVHlwZSAvUGFnZXMKL0tpZHMgWzMgMCBSXQovQ291bnQgMQo+PgplbmRvYmoKCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCgo0IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKCjUgMCBvYmoKPDwKL0xlbmd0aCA2NQo+PgpzdHJlYW0KQlQKL0YxIDEyIFRmCjUwIDc1MCBUZAooRG9jdW1lbnRvIEVsZWN0csOzbmljbyBERU1PKSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCgoKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo2MTYK';
  }


} 