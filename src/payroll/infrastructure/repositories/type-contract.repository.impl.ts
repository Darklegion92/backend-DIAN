import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeContract } from '../../domain/entities/type-contract.entity';
import { TypeContractRepository } from '../../domain/repositories/type-contract.repository';

/**
 * Implementación del repositorio de tipos de contrato usando TypeORM
 */
@Injectable()
export class TypeContractRepositoryImpl implements TypeContractRepository {
  constructor(
    @InjectRepository(TypeContract)
    private readonly repository: Repository<TypeContract>,
  ) {}

  /**
   * @inheritdoc
   */
  async findByCode(code: string): Promise<TypeContract | null> {
    return this.repository.findOne({ where: { code } });
  }

  /**
   * @inheritdoc
   */
  async findById(id: number): Promise<TypeContract | null> {
    return this.repository.findOne({ where: { id } });
  }

  /**
   * @inheritdoc
   */
  async findAll(): Promise<TypeContract[]> {
    return this.repository.find();
  }

  /**
   * @inheritdoc
   */
  async save(typeContract: TypeContract): Promise<TypeContract> {
    return this.repository.save(typeContract);
  }
} 