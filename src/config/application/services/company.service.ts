import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../domain/entities/company.entity';
import { Certificate } from '../../domain/entities/certificate.entity';
import { User, UserRole } from '../../../auth/domain/entities/user.entity';
import { CompanyWithCertificateDto } from '../dto/company-with-certificate.dto';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dtos/paginated-response.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
  ) {}

  async getCompaniesByUserPaginated(
    currentUser: User, 
    paginationQuery: PaginationQueryDto
  ): Promise<PaginatedResponseDto<CompanyWithCertificateDto>> {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationQuery;
    
    // Calcular offset directamente
    const offset = (page - 1) * limit;
    
    let queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.soltecUser', 'soltecUser');

    // Aplicar filtros según rol
    if (currentUser.role !== UserRole.ADMIN) {
      queryBuilder = queryBuilder.where('company.soltec_user_id = :userId', { userId: currentUser.id });
    }

    // Aplicar ordenamiento y paginación
    queryBuilder = queryBuilder
      .orderBy(`company.${sortBy}`, sortOrder)
      .skip(offset)
      .take(limit);

    const [companies, totalItems] = await queryBuilder.getManyAndCount();

    // Procesar companies con certificados
    const companiesWithCertificates: CompanyWithCertificateDto[] = [];

    for (const company of companies) {
      const certificate = await this.certificateRepository
        .createQueryBuilder('certificate')
        .where('certificate.company_id = :companyId', { companyId: company.id })
        .getOne();

      companiesWithCertificates.push(this.mapToCompanyWithCertificateDto(company, certificate));
    }

    return PaginatedResponseDto.create(
      companiesWithCertificates,
      totalItems,
      page,
      limit,
    );
  }

  async getCompanyWithCertificateById(companyId: number, currentUser: User): Promise<CompanyWithCertificateDto | null> {
    // Verificar permisos
    let company: Company;

    if (currentUser.role === UserRole.ADMIN) {
      company = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.soltecUser', 'soltecUser')
        .where('company.id = :companyId', { companyId })
        .getOne();
    } else {
      company = await this.companyRepository
        .createQueryBuilder('company')
        .leftJoinAndSelect('company.soltecUser', 'soltecUser')
        .where('company.id = :companyId', { companyId })
        .andWhere('company.soltec_user_id = :userId', { userId: currentUser.id })
        .getOne();
    }

    if (!company) {
      return null;
    }

    // Obtener certificado
    const certificate = await this.certificateRepository
      .createQueryBuilder('certificate')
      .where('certificate.company_id = :companyId', { companyId: company.id })
      .getOne();

    return this.mapToCompanyWithCertificateDto(company, certificate);
  }

  private mapToCompanyWithCertificateDto(company: Company, certificate?: Certificate): CompanyWithCertificateDto {
    return {
      id: company.id,
      identificationNumber: company.identificationNumber,
      dv: company.dv,
      typeDocumentIdentificationId: company.typeDocumentIdentificationId,
      typeOrganizationId: company.typeOrganizationId,
      languageId: company.languageId,
      taxId: company.taxId,
      typeOperationId: company.typeOperationId,
      typeRegimeId: company.typeRegimeId,
      typeLiabilityId: company.typeLiabilityId,
      municipalityId: company.municipalityId,
      typeEnvironmentId: company.typeEnvironmentId,
      payrollTypeEnvironmentId: company.payrollTypeEnvironmentId,
      sdTypeEnvironmentId: company.sdTypeEnvironmentId,
      name: company.name,
      address: company.address,
      phone: company.phone,
      web: company.web,
      email: company.email,
      merchantRegistration: company.merchantRegistration,
      state: company.state,
      planDocuments: company.planDocuments,
      planRadianDocuments: company.planRadianDocuments,
      planPayrollDocuments: company.planPayrollDocuments,
      planDsDocuments: company.planDsDocuments,
      planPeriod: company.planPeriod,
      documentsSent: company.documentsSent,
      radianDocumentsSent: company.radianDocumentsSent,
      payrollDocumentsSent: company.payrollDocumentsSent,
      dsDocumentsSent: company.dsDocumentsSent,
      planExpirationDate: company.planExpirationDate,
      password: company.password,
      allowSellerLogin: company.allowSellerLogin,
      mailHost: company.mailHost,
      mailPort: company.mailPort,
      mailUsername: company.mailUsername,
      mailPassword: company.mailPassword,
      mailEncryption: company.mailEncryption,
      mailFromAddress: company.mailFromAddress,
      mailFromName: company.mailFromName,
      soltecUserId: company.soltecUserId,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      // Información del certificado
      certificateExpirationDate: certificate?.expirationDate || null,
      certificateId: certificate?.id || null,
      certificateName: certificate?.name || null,
    };
  }
} 