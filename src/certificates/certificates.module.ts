import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Presentation Layer
import { CertificateController } from '@/certificates/presentation/controllers/certificate.controller';

// Application Layer
import { CertificateService } from '@/certificates/application/services/certificate.service';

// Domain Entities
import { Certificate } from '@/certificates/domain/entities/certificate.entity';

// External Modules
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      Certificate,
    ]),
  ],
  controllers: [
    CertificateController
  ],
  providers: [
    CertificateService,
  ],
  exports: [
    CertificateService
  ],
})
export class CertificatesModule {} 