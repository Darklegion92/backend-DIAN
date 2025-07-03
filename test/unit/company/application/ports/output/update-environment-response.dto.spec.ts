import { UpdateEnvironmentResponseDto } from '@/company/application/ports/output/dtos/update-environment-response.dto';
import { Company } from '@/company/domain/entities/company.entity';

describe('UpdateEnvironmentResponseDto', () => {
  it('debería crear una instancia válida', () => {
    // Arrange
    const company: Company = {
      id: 1,
      name: 'Empresa Test',
      identificationNumber: '123456789',
      typeEnvironmentId: 2,
      payrollTypeEnvironmentId: 2,
      eqdocsTypeEnvironmentId: 2,
      dv: '7',
      typeDocumentIdentificationId: 6,
      typeOrganizationId: 2,
      languageId: 79,
      taxId: 1,
      typeOperationId: 2,
      typeRegimeId: 2,
      typeLiabilityId: 14,
      municipalityId: 149,
      address: 'Calle 123',
      phone: '3001234567',
      email: 'test@empresa.com',
      merchantRegistration: '12345678',
      state: true,
      allowSellerLogin: false,
      password: null,
      imapServer: null,
      imapPort: null,
      imapUser: null,
      imapPassword: null,
      imapEncryption: null,
      soltecUserId: null,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      soltecUser: null,
      user: null
    };

    // Act
    const dto = new UpdateEnvironmentResponseDto();
    dto.message = 'Ambiente actualizado correctamente';
    dto.company = company;

    // Assert
    expect(dto).toBeDefined();
    expect(dto.message).toBe('Ambiente actualizado correctamente');
    expect(dto.company).toBe(company);
  });

  it('debería permitir valores nulos en campos opcionales', () => {
    // Arrange & Act
    const dto = new UpdateEnvironmentResponseDto();
    dto.message = 'Ambiente actualizado correctamente';
    dto.company = null;

    // Assert
    expect(dto).toBeDefined();
    expect(dto.message).toBe('Ambiente actualizado correctamente');
    expect(dto.company).toBeNull();
  });

  it('debería mantener la estructura de la empresa', () => {
    // Arrange
    const company: Company = {
      id: 1,
      name: 'Empresa Test',
      identificationNumber: '123456789',
      typeEnvironmentId: 2,
      payrollTypeEnvironmentId: 2,
      eqdocsTypeEnvironmentId: 2,
      dv: '7',
      typeDocumentIdentificationId: 6,
      typeOrganizationId: 2,
      languageId: 79,
      taxId: 1,
      typeOperationId: 2,
      typeRegimeId: 2,
      typeLiabilityId: 14,
      municipalityId: 149,
      address: 'Calle 123',
      phone: '3001234567',
      email: 'test@empresa.com',
      merchantRegistration: '12345678',
      state: true,
      allowSellerLogin: false,
      password: null,
      imapServer: null,
      imapPort: null,
      imapUser: null,
      imapPassword: null,
      imapEncryption: null,
      soltecUserId: null,
      userId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      soltecUser: null,
      user: null
    };

    // Act
    const dto = new UpdateEnvironmentResponseDto();
    dto.message = 'Ambiente actualizado correctamente';
    dto.company = company;

    // Assert
    expect(dto.company.id).toBe(company.id);
    expect(dto.company.name).toBe(company.name);
    expect(dto.company.identificationNumber).toBe(company.identificationNumber);
    expect(dto.company.typeEnvironmentId).toBe(company.typeEnvironmentId);
    expect(dto.company.payrollTypeEnvironmentId).toBe(company.payrollTypeEnvironmentId);
    expect(dto.company.eqdocsTypeEnvironmentId).toBe(company.eqdocsTypeEnvironmentId);
  });
}); 