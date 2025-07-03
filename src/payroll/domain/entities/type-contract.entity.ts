import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * Entidad que representa los tipos de contrato en el sistema
 * @table type_contracts
 */
@Entity('type_contracts')
export class TypeContract {
  /**
   * Identificador único del tipo de contrato
   * @primary true
   * @generated auto_increment
   */
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  /**
   * Nombre del tipo de contrato
   * @example "Término Indefinido", "Término Fijo", "Obra o Labor"
   */
  @Column({ type: 'varchar', length: 191 })
  name: string;

  /**
   * Código único que identifica el tipo de contrato
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

  constructor(partial?: Partial<TypeContract>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
} 