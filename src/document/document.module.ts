import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DocumentController } from './infrastructure/controllers/document.controller';
import { DocumentService } from './domain/services/document.service';
import { Document } from './domain/entities/document.entity';
import { TypeDocument } from './domain/entities/type-document.entity';
import { InvoiceModule } from '../invoice/invoice.module';
import { SharedModule } from '../shared/shared.module';
import { ReceivedDocumentController } from './infrastructure/controllers/received-document.controller';
import { ReceivedDocumentRepository } from './infrastructure/repositories/received-document.repository';
import { ReceivedDocumentService } from './domain/services/received-document.service';
import { ReceivedDocumentEntity } from './infrastructure/entities/received-document.entity';
import { ConfigModule as ConfigModuleConfig } from '../config/config.module';

// TODO: Importar la entidad Document cuando esté disponible
// import { Document } from './domain/entities/document.entity';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([Document, TypeDocument, ReceivedDocumentEntity]),
    JwtModule, // Necesario para que funcionen los guards que dependen de JwtService
    InvoiceModule,
    SharedModule,
    ConfigModuleConfig,
  ],
  controllers: [DocumentController, ReceivedDocumentController],
  providers: [
    DocumentService,
    ReceivedDocumentService,
    {
      provide: 'IReceivedDocumentRepository',
      useClass: ReceivedDocumentRepository,
    }
  ],
  exports: [
    DocumentService
  ]
})
export class DocumentModule {} 