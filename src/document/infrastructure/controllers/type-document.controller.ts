import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { TypeDocument } from '../../domain/entities/type-document.entity';

@ApiTags('Tipos de Documento')
@Controller('type-documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TypeDocumentController {
  constructor(
    @InjectRepository(TypeDocument)
    private readonly typeDocumentRepository: Repository<TypeDocument>,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener tipos de documentos activos',
    description: 'Retorna la lista de tipos de documentos activos disponibles para resoluciones'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de documentos obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          {
            id: 1,
            name: 'Factura Electrónica'
          }
        ]
      }
    }
  })
  async getActiveTypeDocuments() {
    try {
      // Usar consulta SQL directa para evitar problemas con la entidad
      const typeDocuments = await this.typeDocumentRepository.query(`
        SELECT id, name FROM type_documents ORDER BY name ASC
      `);

      return {
        success: true,
        statusCode: 200,
        data: typeDocuments
      };
    } catch (error) {
      console.error('Error en getActiveTypeDocuments:', error);
      throw error;
    }
  }
} 