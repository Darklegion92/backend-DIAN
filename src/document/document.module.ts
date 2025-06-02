import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './infrastructure/controllers/document.controller';
import { TypeDocumentController } from './infrastructure/controllers/type-document.controller';
import { DocumentService } from './domain/services/document.service';
import { Document } from './domain/entities/document.entity';
import { TypeDocument } from './domain/entities/type-document.entity';

// TODO: Importar la entidad Document cuando esté disponible
// import { Document } from './domain/entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, TypeDocument])
  ],
  controllers: [DocumentController, TypeDocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {} 