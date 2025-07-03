import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad que representa los tipos de trabajador en el sistema
 * @table type_workers
 */
@Entity('type_workers')
export class TypeWorker {
  /**
   * Identificador único del tipo de trabajador
   * @primary true
   * @generated auto_increment
   */
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  /**
   * Nombre del tipo de trabajador
   * @example "Dependiente", "Independiente", "Pensionado"
   */
  @Column({ type: 'varchar', length: 191 })
  name: string;

  /**
   * Código único que identifica el tipo de trabajador
   * @example "01", "02", "03"
   */
  @Column({ type: 'char', length: 191 })
  code: string;

  /**
   * Fecha de creación del registro
   */
  @CreateDateColumn({ name: 'created_at', type: 'timestamp', nullable: true })
  createdAt: Date;

  /**
   * Fecha de última actualización del registro
   */
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', nullable: true })
  updatedAt: Date;

  constructor(partial?: Partial<TypeWorker>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
} 