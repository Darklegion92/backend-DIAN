import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('type_item_identifications')
export class TypeItemIdentification {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 191 })
  name: string;

  @Column({ name: 'code', type: 'char', length: 191 })
  code: string;

  @Column({ name: 'code_agency', type: 'char', length: 191, nullable: true })
  codeAgency: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 