import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeWorker } from '../../domain/entities/type-worker.entity';
import { TypeWorkerRepository } from '../../domain/repositories/type-worker.repository';

/**
 * Implementación del repositorio de tipos de trabajador usando TypeORM
 */
@Injectable()
export class TypeWorkerRepositoryImpl implements TypeWorkerRepository {
  constructor(
    @InjectRepository(TypeWorker)
    private readonly repository: Repository<TypeWorker>,
  ) {}

  /**
   * @inheritdoc
   */
  async findByCode(code: string): Promise<TypeWorker | null> {
    return this.repository.findOne({ where: { code } });
  }

  /**
   * @inheritdoc
   */
  async findById(id: number): Promise<TypeWorker | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * @inheritdoc
   */
  async findAll(): Promise<TypeWorker[]> {
    return this.repository.find();
  }

  /**
   * @inheritdoc
   */
  async save(typeWorker: TypeWorker): Promise<TypeWorker> {
    return this.repository.save(typeWorker);
  }
} 