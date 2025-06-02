import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { TypeDocumentIdentification } from '../../domain/entities/type-document-identification.entity';
import { TypeOrganization } from '../../domain/entities/type-organization.entity';
import { TypeRegime } from '../../domain/entities/type-regime.entity';
import { TypeLiability } from '../../domain/entities/type-liability.entity';
import { Municipality } from '../../domain/entities/municipality.entity';

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(TypeDocumentIdentification)
    private readonly documentTypeRepository: Repository<TypeDocumentIdentification>,
    @InjectRepository(TypeOrganization)
    private readonly organizationTypeRepository: Repository<TypeOrganization>,
    @InjectRepository(TypeRegime)
    private readonly regimeTypeRepository: Repository<TypeRegime>,
    @InjectRepository(TypeLiability)
    private readonly liabilityTypeRepository: Repository<TypeLiability>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
  ) {}

  /**
   * Obtener tipos de documento de identificación activos
   */
  async getDocumentTypes() {
    return this.documentTypeRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener tipos de organización activos
   */
  async getOrganizationTypes() {
    return this.organizationTypeRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener tipos de régimen tributario activos
   */
  async getRegimeTypes() {
    return this.regimeTypeRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener tipos de responsabilidad tributaria activos
   */
  async getLiabilityTypes() {
    return this.liabilityTypeRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Buscar municipios con información del departamento concatenada
   */
  async searchMunicipalities(search?: string, limit: number = 20) {
    const queryBuilder = this.municipalityRepository
      .createQueryBuilder('municipality')
      .leftJoinAndSelect('municipality.department', 'department')
      .select([
        'municipality.id',
        'municipality.name', 
        'municipality.code',
        'department.id',
        'department.name',
        'department.code'
      ])
      .orderBy('municipality.name', 'ASC')
      .limit(Math.min(limit, 100)); // Máximo 100 resultados

    // Si hay término de búsqueda, filtrar por nombre del municipio
    if (search && search.trim()) {
      queryBuilder.where('LOWER(municipality.name) LIKE LOWER(:search)', { 
        search: `%${search.trim()}%` 
      });
    }

    const municipalities = await queryBuilder.getMany();

    // Formatear resultados con displayName concatenado
    return municipalities.map(municipality => ({
      id: municipality.id,
      name: municipality.name,
      code: municipality.code,
      displayName: `${municipality.name}, ${municipality.department?.name || 'N/A'}`,
      department: municipality.department ? {
        id: municipality.department.id,
        name: municipality.department.name,
        code: municipality.department.code
      } : null
    }));
  }
} 