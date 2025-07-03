import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('app_versions')
export class AppVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  version: string;

  @Column({ type: 'varchar', length: 500 })
  downloadUrl: string;

  @Column({ type: 'json' })
  changeLog: string[];

  @Column({ type: 'boolean', default: false })
  forceUpdate: boolean;

  @Column({ type: 'date' })
  releaseDate: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ type: 'varchar', length: 255 })
  checksum: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fileName: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  originalFileName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  filePath: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isLatest: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 