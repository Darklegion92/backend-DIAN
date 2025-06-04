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
    description: 'Retorna la lista de tipos de documento de identificación activos disponibles en el sistema, o un tipo específico si se proporciona el código. Accesible para todos los usuarios autenticados.'
  })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Código específico del tipo de documento a buscar',
    example: '13'
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
  @ApiResponse({
    status: 200,
    description: 'Tipo de documento específico obtenido exitosamente (cuando se proporciona código)',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 13, name: 'Cédula de Ciudadanía', code: '13' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de documento no encontrado (cuando se proporciona código)'
  })
  async getDocumentTypes(@Query('code') code?: string) {
    try {
      let data;
      
      if (code && code.trim()) {
        // Buscar por código específico
        data = await this.catalogService.getDocumentTypeByCode(code.trim());
      } else {
        // Obtener todos los tipos de documento
        data = await this.catalogService.getDocumentTypes();
      }
      
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
    description: 'Retorna la lista de tipos de organización activos disponibles en el sistema, o un tipo específico si se proporciona el código'
  })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Código específico del tipo de organización a buscar',
    example: '1'
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
  @ApiResponse({
    status: 200,
    description: 'Tipo de organización específico obtenido exitosamente (cuando se proporciona código)',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 1, name: 'Persona Jurídica', code: '1' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de organización no encontrado (cuando se proporciona código)'
  })
  async getOrganizationTypes(@Query('code') code?: string) {
    try {
      let data;
      
      if (code && code.trim()) {
        // Buscar por código específico
        data = await this.catalogService.getOrganizationTypeByCode(code.trim());
      } else {
        // Obtener todos los tipos de organización
        data = await this.catalogService.getOrganizationTypes();
      }
      
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
    description: 'Retorna la lista de tipos de régimen tributario activos disponibles en el sistema, o un tipo específico si se proporciona el código'
  })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Código específico del tipo de régimen a buscar',
    example: '1'
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
  @ApiResponse({
    status: 200,
    description: 'Tipo de régimen específico obtenido exitosamente (cuando se proporciona código)',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 1, name: 'Régimen Simplificado', code: '1' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de régimen no encontrado (cuando se proporciona código)'
  })
  async getRegimeTypes(@Query('code') code?: string) {
    try {
      let data;
      
      if (code && code.trim()) {
        // Buscar por código específico
        data = await this.catalogService.getRegimeTypeByCode(code.trim());
      } else {
        // Obtener todos los tipos de régimen
        data = await this.catalogService.getRegimeTypes();
      }
      
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
    description: 'Retorna la lista de tipos de responsabilidad tributaria activos disponibles en el sistema, o un tipo específico si se proporciona el código'
  })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Código específico del tipo de responsabilidad a buscar',
    example: '01'
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
  @ApiResponse({
    status: 200,
    description: 'Tipo de responsabilidad específico obtenido exitosamente (cuando se proporciona código)',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 14, name: 'Responsable de IVA', code: '01' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de responsabilidad no encontrado (cuando se proporciona código)'
  })
  async getLiabilityTypes(@Query('code') code?: string) {
    try {
      let data;
      
      if (code && code.trim()) {
        // Buscar por código específico
        data = await this.catalogService.getLiabilityTypeByCode(code.trim());
      } else {
        // Obtener todos los tipos de responsabilidad
        data = await this.catalogService.getLiabilityTypes();
      }
      
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
    description: 'Retorna la lista de unidades de medida activas disponibles en el sistema, o una unidad específica si se proporciona el código'
  })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Código específico de la unidad de medida a buscar',
    example: '94'
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
  @ApiResponse({
    status: 200,
    description: 'Unidad de medida específica obtenida exitosamente (cuando se proporciona código)',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 1, name: 'Unidad', code: '94' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Unidad de medida no encontrada (cuando se proporciona código)'
  })
  async getUnitMeasures(@Query('code') code?: string) {
    try {
      let data;
      
      if (code && code.trim()) {
        // Buscar por código específico
        data = await this.catalogService.getUnitMeasureByCode(code.trim());
      } else {
        // Obtener todas las unidades de medida
        data = await this.catalogService.getUnitMeasures();
      }
      
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
    description: 'Retorna la lista de impuestos activos disponibles en el sistema, o un impuesto específico si se proporciona el código'
  })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Código específico del impuesto a buscar',
    example: '01'
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
  @ApiResponse({
    status: 200,
    description: 'Impuesto específico obtenido exitosamente (cuando se proporciona código)',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 1, name: 'IVA', code: '01', description: 'Impuesto al Valor Agregado' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Impuesto no encontrado (cuando se proporciona código)'
  })
  async getTaxes(@Query('code') code?: string) {
    try {
      let data;
      
      if (code && code.trim()) {
        // Buscar por código específico
        data = await this.catalogService.getTaxByCode(code.trim());
      } else {
        // Obtener todos los impuestos
        data = await this.catalogService.getTaxes();
      }
      
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
    description: 'Retorna la lista de tipos de identificación de items activos disponibles en el sistema, o un tipo específico si se proporciona el código'
  })
  @ApiQuery({
    name: 'code',
    required: false,
    description: 'Código específico del tipo de identificación de item a buscar',
    example: '999'
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
  @ApiResponse({
    status: 200,
    description: 'Tipo de identificación de item específico obtenido exitosamente (cuando se proporciona código)',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        data: { id: 1, name: 'Estándar', code: '999', codeAgency: 'DIAN' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Tipo de identificación de item no encontrado (cuando se proporciona código)'
  })
  async getTypeItemIdentifications(@Query('code') code?: string) {
    try {
      let data;
      
      if (code && code.trim()) {
        // Buscar por código específico
        data = await this.catalogService.getTypeItemIdentificationByCode(code.trim());
      } else {
        // Obtener todos los tipos de identificación de items
        data = await this.catalogService.getTypeItemIdentifications();
      }
      
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