import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from '@/common/common.module';
import { CatalogModule } from '@/catalog/catalog.module';
import { CompaniesModule } from '@/company/companies.module';
import { ReceivedDocumentController } from './presentation/controllers/received-document.controller';
import { ReceivedDocumentService } from './application/services/received-document.service';
import { ReceivedDocument } from '@/received-document/domain/entities/received-document.entity';
import { ReceivedDocumentRepository } from './infrastructure/repositories/received-document.repository';


@Module({
  imports: [
    HttpModule,
    CommonModule,
    CatalogModule,
    CompaniesModule,
    TypeOrmModule.forFeature([ReceivedDocument])
  ],
  controllers: [ReceivedDocumentController],
  providers: [
    ReceivedDocumentService,
    {
      provide: 'IReceivedDocumentRepository',
      useClass: ReceivedDocumentRepository,
    }
  ],
  exports: [
    ReceivedDocumentService
  ]
})
export class ReceivedDocumentModule {} 