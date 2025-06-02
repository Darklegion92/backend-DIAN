import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Company } from '../../domain/entities/company.entity';
import { Certificate } from '../../domain/entities/certificate.entity';
import { User, UserRole } from '../../../auth/domain/entities/user.entity';
import { UserDian } from '../../domain/entities/userDian.entity';
import { CompanyWithCertificateDto } from '../dto/company-with-certificate.dto';
import { CreateCompanyExternalDto } from '../dto/create-company-external.dto';
import { ExternalCompanyResponseDto } from '../dto/external-company-response.dto';
import { ExternalValidationException } from '../exceptions/external-validation.exception';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';
import { PaginatedResponseDto } from '../../../common/dtos/paginated-response.dto';
import { firstValueFrom } from 'rxjs';
import { CompanyFilterQueryDto } from '../dto/company-filter-query.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Certificate)
    private readonly certificateRepository: Repository<Certificate>,
    @InjectRepository(UserDian)
    private readonly userDianRepository: Repository<UserDian>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createCompanyInExternalService(
    companyData: CreateCompanyExternalDto,
    currentUser: User,
  ): Promise<CompanyWithCertificateDto> {
    try {
      const externalServerUrl = this.configService.get<string>(
        'EXTERNAL_SERVER_URL',
      );

      if (!externalServerUrl) {
        throw new Error(
          'EXTERNAL_SERVER_URL no está configurada en las variables de entorno',
        );
      }

      // Extraer nit y digito del body
      const { nit, digito, ...dataToSend } = companyData;
      const url = `${externalServerUrl}/config/${nit}/${digito}`;

      const response = await firstValueFrom(
        this.httpService.post<ExternalCompanyResponseDto>(url, dataToSend, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      // Verificar que la respuesta sea exitosa
      if (!('success' in response.data) || !response.data.success) {
        throw new Error('Respuesta del servicio externo no fue exitosa');
      }

      const externalCompany = response.data.company;

      // Buscar la empresa existente por identification_number
      const existingCompany = await this.companyRepository.findOne({
        where: { identificationNumber: externalCompany.identification_number },
      });

      if (!existingCompany) {
        throw new Error(
          `No se encontró una empresa con NIT ${externalCompany.identification_number} en la base de datos local`,
        );
      }

      // Actualizar solo el soltec_user_id
      existingCompany.soltecUserId = currentUser.id;
      const updatedCompany = await this.companyRepository.save(existingCompany);

      // Buscar el certificado asociado (si existe)
      const certificate = await this.certificateRepository
        .createQueryBuilder('certificate')
        .where('certificate.company_id = :companyId', {
          companyId: updatedCompany.id,
        })
        .getOne();

      return this.mapToCompanyWithCertificateDto(updatedCompany, certificate);
    } catch (error) {
      console.log(error);

      // Si la respuesta del servidor externo tiene datos de error estructurados
      if (error.response?.data) {
        console.log(error);

        const errorData = error.response.data;

        // Si la respuesta tiene el formato de error de validación esperado
        if (errorData.message && errorData.errors) {
          throw new ExternalValidationException(
            errorData.message,
            errorData.errors,
          );
        }
      }

      // Error genérico si no tiene la estructura esperada
      throw new Error(
        `Error al crear compañía en servicio externo: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async getCompaniesByUserPaginated(
    currentUser: User,
    filterQuery: CompanyFilterQueryDto,
  ): Promise<PaginatedResponseDto<CompanyWithCertificateDto>> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      dato,
    } = filterQuery;

    const offset = (page - 1) * limit;

    let queryBuilder = this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.soltecUser', 'soltecUser');

    // Filtro por rol de usuario
    if (currentUser.role !== UserRole.ADMIN) {
      queryBuilder = queryBuilder.where('company.soltec_user_id = :userId', {
        userId: currentUser.id,
      });
    }

    // Aplicar filtros de búsqueda
    if (dato) {
      const searchCondition = '(company.identification_number LIKE :searchTerm OR company.business_name LIKE :searchTerm)';
      
      if (currentUser.role !== UserRole.ADMIN) {
        // Ya hay una condición WHERE para el usuario, agregar AND
        queryBuilder = queryBuilder.andWhere(searchCondition, {
          searchTerm: `%${dato}%`,
        });
      } else {
        // No hay condición WHERE previa, usar WHERE
        queryBuilder = queryBuilder.where(searchCondition, {
          searchTerm: `%${dato}%`,
        });
      }
    }

    queryBuilder = queryBuilder
      .orderBy(`company.${sortBy}`, sortOrder)
      .skip(offset)
      .take(limit);

    const [companies, totalItems] = await queryBuilder.getManyAndCount();

    const companiesWithCertificates: CompanyWithCertificateDto[] = [];

    for (const company of companies) {
      const certificate = await this.certificateRepository
        .createQueryBuilder('certificate')
        .where('certificate.company_id = :companyId', { companyId: company.id })
        .getOne();

      const companyDto = await this.mapToCompanyWithCertificateDto(company, certificate);
      companiesWithCertificates.push(companyDto);
    }

    return PaginatedResponseDto.create(
      companiesWithCertificates,
      totalItems,
      page,
      limit,
    );
  }

  async getCompanyWithCertificateById(
    companyId: number,
    currentUser: User,
  ): Promise<CompanyWithCertificateDto | null> {
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
        .andWhere('company.soltec_user_id = :userId', {
          userId: currentUser.id,
        })
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

  private async mapToCompanyWithCertificateDto(
    company: Company,
    certificate?: Certificate,
  ): Promise<CompanyWithCertificateDto> {
    const user = await this.userDianRepository.findOne({
      where: { id: company.userId },
    });

    const tokenDian = user?.apiToken || null;

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
      eqdocsTypeEnvironmentId: company.eqdocsTypeEnvironmentId,
      address: company.address,
      phone: company.phone,
      merchantRegistration: company.merchantRegistration,
      state: company.state,
      password: company.password,
      allowSellerLogin: company.allowSellerLogin,
      imapServer: company.imapServer,
      imapPort: company.imapPort,
      imapUser: company.imapUser,
      imapPassword: company.imapPassword,
      imapEncryption: company.imapEncryption,
      soltecUserId: company.soltecUserId,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      certificateExpirationDate: certificate?.expirationDate || null,
      certificateId: certificate?.id || null,
      certificateName: certificate?.name || null,
      tokenDian,
    };
  }
}
