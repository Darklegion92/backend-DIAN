import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { DocumentController } from './infrastructure/controllers/document.controller';
import { DocumentService } from './domain/services/document.service';
import { Document } from './domain/entities/document.entity';
import { TypeDocument } from './domain/entities/type-document.entity';
import { InvoiceModule } from '../invoice/invoice.module';
import { SharedModule } from '../shared/shared.module';

// TODO: Importar la entidad Document cuando esté disponible
// import { Document } from './domain/entities/document.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Document, TypeDocument]),
    JwtModule, // Necesario para que funcionen los guards que dependen de JwtService
    InvoiceModule,
    SharedModule
  ],
  controllers: [DocumentController],
  providers: [
    DocumentService
  ],
  exports: [
    DocumentService
  ]
})
export class DocumentModule {} 