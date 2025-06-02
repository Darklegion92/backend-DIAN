import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentListRequest, DocumentListResponse, DocumentData } from '../entities/document.interface';
import { Document } from '../entities/document.entity';

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
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
} 