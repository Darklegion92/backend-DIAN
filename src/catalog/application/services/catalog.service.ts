import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { TypeDocumentIdentification } from '../../domain/entities/type-document-identification.entity';
import { TypeOrganization } from '../../domain/entities/type-organization.entity';
import { TypeRegime } from '../../domain/entities/type-regime.entity';
import { TypeLiability } from '../../domain/entities/type-liability.entity';
import { Municipality } from '../../domain/entities/municipality.entity';
import { UnitMeasure } from '../../domain/entities/unit-measure.entity';
import { Tax } from '../../domain/entities/tax.entity';
import { TypeItemIdentification } from '../../domain/entities/type-item-identification.entity';
import { TypeDocument } from '../../domain/entities/type-document.entity';
import { PaymentForm } from '../../domain/entities/payment-form.entity';
import { PaymentMethod } from '../../domain/entities/payment-method.entity';
import { TypeOperation } from '../../domain/entities/type-operation.entity';
import { Discount } from '../../domain/entities/discount.entity';

/**
 * Servicio de aplicación para gestionar el catálogo
 * 
 * NOTA SOBRE ARQUITECTURA HEXAGONAL:
 * Este servicio actúa temporalmente como una fachada para acceder a los datos del catálogo.
 * Para una implementación completa de arquitectura hexagonal, se recomienda:
 * 
 * 1. Mover la lógica de acceso a datos a la capa de infrastructure/persistence
 * 2. Crear casos de uso específicos en application/use-cases/
 * 3. Definir interfaces de repositorio en domain/repositories/
 * 4. Implementar puertos de entrada y salida en application/ports/
 * 5. Crear controladores en presentation/controllers/
 * 
 * Esta estructura permite mejor testabilidad, mantenibilidad y separación de responsabilidades.
 */
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
    @InjectRepository(UnitMeasure)
    private readonly unitMeasureRepository: Repository<UnitMeasure>,
    @InjectRepository(Tax)
    private readonly taxRepository: Repository<Tax>,
    @InjectRepository(TypeItemIdentification)
    private readonly typeItemIdentificationRepository: Repository<TypeItemIdentification>,
    @InjectRepository(TypeDocument)
    private readonly typeDocumentRepository: Repository<TypeDocument>,
    @InjectRepository(PaymentForm)
    private readonly paymentFormRepository: Repository<PaymentForm>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(TypeOperation)
    private readonly typeOperationRepository: Repository<TypeOperation>,
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  // ========================================================================
  // TIPOS DE DOCUMENTO DE IDENTIFICACIÓN
  // ========================================================================

  /**
   * Obtener tipos de documento de identificación activos
   * @returns Promise<TypeDocumentIdentification[]> Lista de tipos de documento ordenados por nombre
   */
  async getDocumentTypes(): Promise<TypeDocumentIdentification[]> {
    try {
      return await this.documentTypeRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' }
    });
    } catch (error) {
      throw new Error(`Error al obtener tipos de documento: ${error.message}`);
    }
  }

  /**
   * Obtener tipo de documento de identificación por código
   * @param code - Código del tipo de documento
   * @returns Promise<TypeDocumentIdentification> Tipo de documento encontrado
   * @throws Error si el código es inválido o no se encuentra
   */
  async getDocumentTypeByCode(code: string): Promise<TypeDocumentIdentification> {
    if (!code || code.trim() === '') {
      throw new Error('Código de tipo de documento es requerido');
    }

    try {
    const documentType = await this.documentTypeRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    if (!documentType) {
      throw new Error(`Tipo de documento con código '${code}' no encontrado`);
    }

    return documentType;
    } catch (error) {
      if (error.message.includes('no encontrado') || error.message.includes('requerido')) {
        throw error;
      }
      throw new Error(`Error al buscar tipo de documento: ${error.message}`);
    }
  }

  /**
   * Obtener ID de tipo de documento de identificación por código
   */
  async getDocumentTypeIdByCode(code: string): Promise<number> {
    const documentType = await this.getDocumentTypeByCode(code);
    return documentType.id || 3 ;
  }

  // ========================================================================
  // TIPOS DE ORGANIZACIÓN
  // ========================================================================

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
   * Obtener tipo de organización por código
   */
  async getOrganizationTypeByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de tipo de organización es requerido');
    }

    const organizationType = await this.organizationTypeRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    if (!organizationType) {
      throw new Error(`Tipo de organización con código '${code}' no encontrado`);
    }

    return organizationType;
  }

  /**
   * Obtener ID de tipo de organización por código
   */
  async getOrganizationTypeIdByCode(code: string): Promise<number> {
    const organizationType = await this.getOrganizationTypeByCode(code);
    return organizationType?.id || 2;
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
   * Obtener tipo de régimen tributario por código
   */
  async getRegimeTypeByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de tipo de régimen es requerido');
    }

    const regimeType = await this.regimeTypeRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });
    
    return regimeType;
  }

  /**
   * Obtener ID de tipo de régimen tributario por código
   */
  async getRegimeTypeIdByCode(code: string): Promise<number> {
    const regimeType = await this.getRegimeTypeByCode(code);
    return regimeType?.id;
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
   * Obtener tipo de responsabilidad tributaria por código
   */
  async getLiabilityTypeByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de tipo de responsabilidad es requerido');
    }

    const liabilityType = await this.liabilityTypeRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    return liabilityType;
  }

  /**
   * Obtener ID de tipo de responsabilidad tributaria por código
   */
  async getLiabilityTypeIdByCode(code: string): Promise<number> {
    const liabilityType = await this.getLiabilityTypeByCode(code);
    return liabilityType?.id || 117;
  }

  // ========================================================================
  // MUNICIPIOS Y GEOGRAFÍA
  // ========================================================================

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

  /**
   * Obtener un municipio específico por ID
   */
  async getMunicipalityById(id: number) {
    const municipality = await this.municipalityRepository
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
      .where('municipality.id = :id', { id })
      .getOne();

    if (!municipality) {
      throw new Error(`Municipio con ID ${id} no encontrado`);
    }

    // Formatear resultado con displayName concatenado
    return {
      id: municipality.id,
      name: municipality.name,
      code: municipality.code,
      displayName: `${municipality.name}, ${municipality.department?.name || 'N/A'}`,
      department: municipality.department ? {
        id: municipality.department.id,
        name: municipality.department.name,
        code: municipality.department.code
      } : null
    };
  }

  /**
   * Obtener municipio por código
   * @param code Código del municipio (incluye código del departamento)
   */
  async getMunicipalityByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de municipio es requerido');
    }

    const municipality = await this.municipalityRepository
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
      .where('municipality.code = :code', { code: code.trim() })
      .getOne();

    if (!municipality) {
      throw new Error(`Municipio con código '${code}' no encontrado`);
    }

    // Formatear resultado con displayName concatenado
    return {
      id: municipality.id,
      name: municipality.name,
      code: municipality.code,
      displayName: `${municipality.name}, ${municipality.department?.name || 'N/A'}`,
      department: municipality.department ? {
        id: municipality.department.id,
        name: municipality.department.name,
        code: municipality.department.code
      } : null
    };
  }


  async getMunicipalityIdByCode(code: string): Promise<number> {
    const municipality = await this.getMunicipalityByCode(code);
    return municipality.id;
  }

  /**
   * Obtener unidades de medida activas
   */
  async getUnitMeasures() {
    return this.unitMeasureRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener unidad de medida por código
   */
  async getUnitMeasureByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de unidad de medida es requerido');
    }
    const unitMeasure = await this.unitMeasureRepository.findOne({
      where: { 
        code: code.trim(),
      },
      select: ['id', 'name', 'code']
    });

    if (!unitMeasure) {
      throw new Error(`Unidad de medida con código '${code}' no encontrada`);
    }

    return unitMeasure;
  }

  /**
   * Obtener ID de unidad de medida por código
   */
  async getUnitMeasureIdByCode(code: string): Promise<number> {
    const unitMeasure = await this.getUnitMeasureByCode(code);
    return unitMeasure.id;
  }

  /**
   * Obtener impuestos activos
   */
  async getTaxes() {
    return this.taxRepository.find({
      select: ['id', 'name', 'code', 'description'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener impuesto por código
   */
  async getTaxByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de impuesto es requerido');
    }

    const tax = await this.taxRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code', 'description']
    });

    if (!tax) {
      throw new Error(`Impuesto con código '${code}' no encontrado`);
    }

    return tax;
  }

  /**
   * Obtener ID de impuesto por código
   */
  async getTaxIdByCode(code: string): Promise<number> {
    const tax = await this.getTaxByCode(code);
    return tax.id;
  }

  /**
   * Obtener tipos de identificación de items activos
   */
  async getTypeItemIdentifications() {
    return this.typeItemIdentificationRepository.find({
      select: ['id', 'name', 'code', 'codeAgency'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener tipo de identificación de item por código
   */
  async getTypeItemIdentificationByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de tipo de identificación de item es requerido');
    }

    const typeItemIdentification = await this.typeItemIdentificationRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code', 'codeAgency']
    });

    if (!typeItemIdentification) {
      throw new Error(`Tipo de identificación de item con código '${code}' no encontrado`);
    }

    return typeItemIdentification;
  }

  /**
   * Obtener tipos de documento activos
   */
  async getTypeDocuments() {
    return this.typeDocumentRepository.find({
      select: ['id', 'name'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener ID de tipo de item de identificación por código
   */
  async getTypeItemIdentificationIdByCode(code: string): Promise<number> {
    const typeItemIdentification = await this.getTypeItemIdentificationByCode(code);
    return typeItemIdentification.id;
  }

  /**
   * Obtener formas de pago activas
   */
  async getPaymentForms() {
    return this.paymentFormRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener forma de pago por código
   */
  async getPaymentFormByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de forma de pago es requerido');
    }

    const paymentForm = await this.paymentFormRepository.findOne({
      where: { 
        code: code.trim(),
      },
      select: ['id', 'name', 'code']
    });

    if (!paymentForm) {
      throw new Error(`Forma de pago con código '${code}' no encontrada`);
    }

    return paymentForm;
  }

  /**
   * Obtener ID de forma de pago por código
   */
  async getPaymentFormIdByCode(code: string): Promise<number> {
    const paymentForm = await this.getPaymentFormByCode(code);
    return paymentForm.id;
  }

  /**
   * Obtener métodos de pago activos
   */
  async getPaymentMethods() {
    return this.paymentMethodRepository.find({
      select: ['id', 'name', 'code'],
      order: { name: 'ASC' }
    });
  }

  /**
   * Obtener método de pago por código
   */
  async getPaymentMethodByCode(code: string) {
    if (!code || code.trim() === '') {
      throw new Error('Código de método de pago es requerido');
    }

    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    return paymentMethod;
  }

  /**
   * Obtener ID de método de pago por código
   */
  async getPaymentMethodIdByCode(code: string): Promise<number> {
    const paymentMethod = await this.getPaymentMethodByCode(code);
    return paymentMethod?.id || 75;
  }

  /**
   * Obtener tipo de operación por código
   */
  async getTypeOperationByCode(code: string) {
    const typeOperation = await this.typeOperationRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    if (!typeOperation) {
      throw new Error(`Tipo de operación con código '${code}' no encontrado`);
    }

    return typeOperation;
  }

  /**
   * Obtener ID de tipo de operación por código
   */
  async getTypeOperationIdByCode(code: string): Promise<number> {
    const typeOperation = await this.getTypeOperationByCode(code);
    return typeOperation.id;
  }

  /**
   * Obtener ID de descuento por código
   */
  async getDiscountIdByCode(code: string): Promise<number> {
    const discount = await this.discountRepository.findOne({
      where: { code: code.trim() },
      select: ['id', 'name', 'code']
    });

    if (!discount) {
      throw new Error(`Descuento con código '${code}' no encontrado`);
    }

    return discount.id;
  }

  // ========================================================================
  // MÉTODOS DE UTILIDAD PARA ARQUITECTURA HEXAGONAL
  // ========================================================================
  
  /**
   * Obtiene todos los catálogos básicos en un solo llamado
   * Útil para inicialización de aplicaciones
   */
  async getAllBasicCatalogs() {
    const [
      documentTypes,
      organizationTypes,
      regimeTypes,
      liabilityTypes,
      unitMeasures,
      taxes,
      paymentForms,
      paymentMethods,
      typeDocuments,
      typeItemIdentifications
    ] = await Promise.all([
      this.getDocumentTypes(),
      this.getOrganizationTypes(),
      this.getRegimeTypes(),
      this.getLiabilityTypes(),
      this.getUnitMeasures(),
      this.getTaxes(),
      this.getPaymentForms(),
      this.getPaymentMethods(),
      this.getTypeDocuments(),
      this.getTypeItemIdentifications()
    ]);

    return {
      documentTypes,
      organizationTypes,
      regimeTypes,
      liabilityTypes,
      unitMeasures,
      taxes,
      paymentForms,
      paymentMethods,
      typeDocuments,
      typeItemIdentifications
    };
  }
} 