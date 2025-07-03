import { TypeWorker } from '../entities/type-worker.entity';

/**
 * Interfaz que define las operaciones disponibles para el repositorio de tipos de trabajador
 */
export interface TypeWorkerRepository {
  /**
   * Encuentra un tipo de trabajador por su código
   * @param code Código del tipo de trabajador
   * @returns El tipo de trabajador encontrado o null si no existe
   */
  findByCode(code: string): Promise<TypeWorker | null>;

  /**
   * Encuentra un tipo de trabajador por su ID
   * @param id ID del tipo de trabajador
   * @returns El tipo de trabajador encontrado o null si no existe
   */
  findById(id: number): Promise<TypeWorker | null>;

  /**
   * Obtiene todos los tipos de trabajador
   * @returns Lista de tipos de trabajador
   */
  findAll(): Promise<TypeWorker[]>;

  /**
   * Guarda un nuevo tipo de trabajador
   * @param typeWorker Datos del tipo de trabajador a guardar
   * @returns El tipo de trabajador guardado
   */
  save(typeWorker: TypeWorker): Promise<TypeWorker>;
} 