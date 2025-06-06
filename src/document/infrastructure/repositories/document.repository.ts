import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../../domain/entities/document.entity';

@Injectable()
export class DocumentRepository {
  constructor(
    @InjectRepository(Document)
    private readonly repository: Repository<Document>
  ) {}

  async findById(id: number): Promise<Document> {
    return this.repository.findOne({ where: { id } });
  }

  async save(document: Document): Promise<Document> {
    return this.repository.save(document);
  }

  async findOne(prefix: string, number: string, nit: string): Promise<Document> {
    return this.repository.findOne({ where: { prefix, number, stateDocumentId: 1, identificationNumber:nit } });
  }
} 