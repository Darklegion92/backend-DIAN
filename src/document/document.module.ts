import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentController } from './infrastructure/controllers/document.controller';
import { DocumentService } from './domain/services/document.service';
import { Document } from './domain/entities/document.entity';

// TODO: Importar la entidad Document cuando esté disponible
// import { Document } from './domain/entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document])
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [DocumentService],
})
export class DocumentModule {} 