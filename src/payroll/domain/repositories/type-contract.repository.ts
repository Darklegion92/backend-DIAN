import { TypeContract } from '../entities/type-contract.entity';

/**
 * Interfaz que define las operaciones disponibles para el repositorio de tipos de contrato
 */
export interface TypeContractRepository {
  /**
   * Encuentra un tipo de contrato por su código
   * @param code Código del tipo de contrato
   * @returns El tipo de contrato encontrado o null si no existe
   */
  findByCode(code: string): Promise<TypeContract | null>;

  /**
   * Encuentra un tipo de contrato por su ID
   * @param id ID del tipo de contrato
   * @returns El tipo de contrato encontrado o null si no existe
   */
  findById(id: number): Promise<TypeContract | null>;

  /**
   * Obtiene todos los tipos de contrato
   * @returns Lista de tipos de contrato
   */
  findAll(): Promise<TypeContract[]>;

  /**
   * Guarda un nuevo tipo de contrato
   * @param typeContract Datos del tipo de contrato a guardar
   * @returns El tipo de contrato guardado
   */
  save(typeContract: TypeContract): Promise<TypeContract>;
} 