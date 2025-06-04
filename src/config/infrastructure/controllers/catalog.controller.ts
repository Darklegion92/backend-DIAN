import { Controller, Get, Query, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CatalogService } from '../../application/services/catalog.service';

// /api/catalogs/* TODOS - Todos los endpoints de catálogos son accesibles para todos los usuarios autenticados
@ApiTags('Catálogos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('catalogs')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('document-types')
  @ApiOperation({
    summary: 'Obtener tipos de documento de identificación',
    description: 'Retorna la lista de tipos de documento de identificación activos disponibles en el sistema. Accesible para todos los usuarios autenticados.'
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

  @Get('unit-measures')
  @ApiOperation({
    summary: 'Obtener unidades de medida',
    description: 'Retorna la lista de unidades de medida activas disponibles en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de unidades de medida obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { id: 1, name: 'Unidad', code: '94' },
          { id: 2, name: 'Kilogramo', code: 'KGM' }
        ]
      }
    }
  })
  async getUnitMeasures() {
    try {
      const data = await this.catalogService.getUnitMeasures();
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('unit-measures/by-code/:code')
  @ApiOperation({
    summary: 'Obtener unidad de medida por código',
    description: 'Obtiene una unidad de medida específica por su código'
  })
  @ApiResponse({
    status: 200,
    description: 'Unidad de medida obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { 
          id: 1, 
          name: 'Unidad', 
          code: '94'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Unidad de medida no encontrada'
  })
  async getUnitMeasureByCode(@Param('code') code: string) {
    try {
      const data = await this.catalogService.getUnitMeasureByCode(code);
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('taxes')
  @ApiOperation({
    summary: 'Obtener impuestos',
    description: 'Retorna la lista de impuestos activos disponibles en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de impuestos obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { id: 1, name: 'IVA', code: '01', description: 'Impuesto al Valor Agregado' },
          { id: 2, name: 'ICA', code: '03', description: 'Impuesto de Industria y Comercio' }
        ]
      }
    }
  })
  async getTaxes() {
    try {
      const data = await this.catalogService.getTaxes();
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('taxes/by-code/:code')
  @ApiOperation({
    summary: 'Obtener impuesto por código',
    description: 'Obtiene un impuesto específico por su código'
  })
  @ApiResponse({
    status: 200,
    description: 'Impuesto obtenido exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { 
          id: 1, 
          name: 'IVA', 
          code: '01',
          description: 'Impuesto al Valor Agregado'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Impuesto no encontrado'
  })
  async getTaxByCode(@Param('code') code: string) {
    try {
      const data = await this.catalogService.getTaxByCode(code);
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('type-item-identifications')
  @ApiOperation({
    summary: 'Obtener tipos de identificación de items',
    description: 'Retorna la lista de tipos de identificación de items activos disponibles en el sistema'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de identificación de items obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { id: 1, name: 'Estándar', code: '999', codeAgency: 'DIAN' },
          { id: 2, name: 'GTIN', code: '010', codeAgency: 'GS1' }
        ]
      }
    }
  })
  async getTypeItemIdentifications() {
    try {
      const data = await this.catalogService.getTypeItemIdentifications();
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('type-item-identifications/by-code/:code')
  @ApiOperation({
    summary: 'Obtener tipo de identificación de item por código',
    description: 'Obtiene un tipo de identificación de item específico por su código'
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de identificación de item obtenido exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { 
          id: 1, 
          name: 'Estándar', 
          code: '999',
          codeAgency: 'DIAN'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de identificación de item no encontrado'
  })
  async getTypeItemIdentificationByCode(@Param('code') code: string) {
    try {
      const data = await this.catalogService.getTypeItemIdentificationByCode(code);
      return {
        success: true,
        statusCode: 200,
        data
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('type-documents')
  @ApiOperation({
    summary: 'Obtener tipos de documentos',
    description: 'Retorna la lista de tipos de documentos activos disponibles en el sistema. Accesible para todos los usuarios autenticados.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de documentos obtenida exitosamente',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: [
          { id: 1, name: 'Factura Electrónica' },
          { id: 2, name: 'Nota Crédito' },
          { id: 3, name: 'Nota Débito' }
        ]
      }
    }
  })
  async getTypeDocuments() {
    try {
      const data = await this.catalogService.getTypeDocuments();
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