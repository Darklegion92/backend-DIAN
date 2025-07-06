import { Injectable } from '@nestjs/common';
import { Document } from '../../domain/entities/document.entity';

@Injectable()
export class DocumentRepository {
  private documents: Map<string, Document>;

  constructor() {
    this.documents = new Map<string, Document>();
  }

  async save(document: Document): Promise<void> {
    this.documents.set(document.trackId, document);
  }

  async findByTrackId(trackId: string): Promise<Document | undefined> {
    return this.documents.get(trackId);
  }

  async update(document: Document): Promise<void> {
    this.documents.set(document.trackId, document);
  }
} 