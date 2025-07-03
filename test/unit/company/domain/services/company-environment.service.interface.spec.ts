import { EXTERNAL_API_SERVICE } from '@/company/domain/services/company-environment.service.interface';
import { UpdateEnvironmentDto } from '@/company/application/ports/input/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '@/company/application/ports/output/dtos/update-environment-response.dto';
import { Company } from '@/company/domain/entities/company.entity';
import { ICompanyEnvironmentService } from '@/company/domain/services/company-environment.service.interface';

describe('IExternalApiService', () => {
  let service: ICompanyEnvironmentService;

  const createMockCompany = (overrides: Partial<Company> = {}): Company => ({
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
    user: null,
    ...overrides
  });

  beforeEach(() => {
    service = {
      updateEnvironment: jest.fn(),
    };
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
    expect(EXTERNAL_API_SERVICE).toBe('EXTERNAL_API_SERVICE');
  });

  it('debería tener el método updateEnvironment', () => {
    expect(service.updateEnvironment).toBeDefined();
    expect(typeof service.updateEnvironment).toBe('function');
  });

  it('debería aceptar y retornar los tipos correctos', async () => {
    // Arrange
    const updateDto: UpdateEnvironmentDto = {
      type_environment_id: 2,
      payroll_type_environment_id: 2,
      eqdocs_type_environment_id: 2,
      token: '1234567890',
    };

    const expectedResponse: UpdateEnvironmentResponseDto = {
      message: 'Ambiente actualizado correctamente',
      company: createMockCompany(),
    };

    (service.updateEnvironment as jest.Mock).mockResolvedValue(expectedResponse);

    // Act
    const result = await service.updateEnvironment(updateDto);

    // Assert
    expect(result).toBeDefined();
    expect(result).toEqual(expectedResponse);
    expect(result.message).toBe('Ambiente actualizado correctamente');
    expect(result.company).toBeDefined();
    expect(result.company.id).toBe(1);
    expect(result.company.name).toBe('Empresa Test');
  });

  it('debería manejar errores correctamente', async () => {
    // Arrange
    const updateDto: UpdateEnvironmentDto = {
      type_environment_id: 2,
      payroll_type_environment_id: 2,
      eqdocs_type_environment_id: 2,
      token: '1234567890',
    };

    const error = new Error('Error al actualizar ambiente');
    (service.updateEnvironment as jest.Mock).mockRejectedValue(error);

    // Act & Assert
    await expect(service.updateEnvironment(updateDto)).rejects.toThrow(error);
  });
}); 