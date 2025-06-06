import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../document/domain/entities/document.entity';
import { DocumentRepository } from '../document/infrastructure/repositories/document.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document])
  ],
  providers: [
    DocumentRepository
  ],
  exports: [
    DocumentRepository
  ]
})
export class SharedModule {} 