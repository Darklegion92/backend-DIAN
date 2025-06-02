import { Controller, Get, Query, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CatalogService } from '../../application/services/catalog.service';

@ApiTags('Catálogos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalogs')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('document-types')
  @ApiOperation({
    summary: 'Obtener tipos de documento de identificación',
    description: 'Retorna la lista de tipos de documento de identificación activos disponibles en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de documento obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { id: 6, name: 'NIT', code: '31' },
          { id: 13, name: 'Cédula de Ciudadanía', code: '13' }
        ]
      }
    }
  })
  async getDocumentTypes() {
    try {
      const data = await this.catalogService.getDocumentTypes();
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('organization-types')
  @ApiOperation({
    summary: 'Obtener tipos de organización',
    description: 'Retorna la lista de tipos de organización activos disponibles en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de organización obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { id: 1, name: 'Persona Jurídica', code: '1' },
          { id: 2, name: 'Persona Natural', code: '2' }
        ]
      }
    }
  })
  async getOrganizationTypes() {
    try {
      const data = await this.catalogService.getOrganizationTypes();
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('regime-types')
  @ApiOperation({
    summary: 'Obtener tipos de régimen tributario',
    description: 'Retorna la lista de tipos de régimen tributario activos disponibles en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de régimen obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { id: 1, name: 'Régimen Simplificado', code: '1' },
          { id: 2, name: 'Régimen Común', code: '2' }
        ]
      }
    }
  })
  async getRegimeTypes() {
    try {
      const data = await this.catalogService.getRegimeTypes();
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('liability-types')
  @ApiOperation({
    summary: 'Obtener tipos de responsabilidad tributaria',
    description: 'Retorna la lista de tipos de responsabilidad tributaria activos disponibles en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de responsabilidad obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { id: 14, name: 'Responsable de IVA', code: '01' },
          { id: 15, name: 'No responsable de IVA', code: '02' }
        ]
      }
    }
  })
  async getLiabilityTypes() {
    try {
      const data = await this.catalogService.getLiabilityTypes();
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('municipalities')
  @ApiOperation({
    summary: 'Buscar municipios',
    description: 'Busca municipios por nombre con paginación. Incluye información del departamento concatenada.'
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Término de búsqueda para filtrar municipios por nombre',
    example: 'Bogotá'
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número máximo de resultados a retornar',
    example: 20
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de municipios obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { 
            id: 149, 
            name: 'Bogotá D.C.', 
            code: '11001',
            displayName: 'Bogotá D.C., Bogotá D.C.',
            department: {
              id: 1,
              name: 'Bogotá D.C.',
              code: '11'
            }
          }
        ]
      }
    }
  })
  async searchMunicipalities(
    @Query('search') search?: string,
    @Query('limit') limit?: number
  ) {
    try {
      const data = await this.catalogService.searchMunicipalities(search, limit);
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('municipalities/:id')
  @ApiOperation({
    summary: 'Obtener municipio por ID',
    description: 'Obtiene un municipio específico por su ID, incluyendo información del departamento'
  })
  @ApiResponse({
    status: 200,
    description: 'Municipio obtenido exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { 
          id: 149, 
          name: 'Bogotá D.C.', 
          code: '11001',
          displayName: 'Bogotá D.C., Bogotá D.C.',
          department: {
            id: 1,
            name: 'Bogotá D.C.',
            code: '11'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Municipio no encontrado'
  })
  async getMunicipalityById(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.catalogService.getMunicipalityById(id);
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }
} 