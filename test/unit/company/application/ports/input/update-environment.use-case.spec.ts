import { Test, TestingModule } from '@nestjs/testing';
import { UpdateEnvironmentUseCase } from '@/company/application/use-cases/update-environment.use-case';
import { ICompanyEnvironmentService, EXTERNAL_API_SERVICE } from '@/company/domain/services/company-environment.service.interface';
import { UpdateEnvironmentDto } from '@/company/application/ports/input/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '@/company/application/ports/output/dtos/update-environment-response.dto';
import { Company } from '@/company/domain/entities/company.entity';

describe('UpdateEnvironmentUseCase', () => {
  let useCase: UpdateEnvironmentUseCase;
  let externalApiService: jest.Mocked<ICompanyEnvironmentService>;

  const mockExternalApiService = {
    updateEnvironment: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateEnvironmentUseCase,
        {
          provide: EXTERNAL_API_SERVICE,
          useValue: mockExternalApiService,
        },
      ],
    }).compile();

    useCase = module.get<UpdateEnvironmentUseCase>(UpdateEnvironmentUseCase);
    externalApiService = module.get(EXTERNAL_API_SERVICE);
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(useCase).toBeDefined();
  });

  it('debería actualizar el ambiente correctamente', async () => {
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

    externalApiService.updateEnvironment.mockResolvedValue(expectedResponse);

    // Act
    const result = await useCase.execute(updateDto);

    // Assert
    expect(result).toEqual(expectedResponse);
    expect(externalApiService.updateEnvironment).toHaveBeenCalledWith(updateDto);
    expect(externalApiService.updateEnvironment).toHaveBeenCalledTimes(1);
  });

  it('debería manejar errores del servicio externo', async () => {
    // Arrange
    const updateDto: UpdateEnvironmentDto = {
      type_environment_id: 2,
      payroll_type_environment_id: 2,
      eqdocs_type_environment_id: 2,
      token: '1234567890',
    };

    const error = new Error('Error al actualizar ambiente');
    externalApiService.updateEnvironment.mockRejectedValue(error);

    // Act & Assert
    await expect(useCase.execute(updateDto)).rejects.toThrow(error);
    expect(externalApiService.updateEnvironment).toHaveBeenCalledWith(updateDto);
    expect(externalApiService.updateEnvironment).toHaveBeenCalledTimes(1);
  });

  it('debería actualizar el ambiente con campos opcionales omitidos', async () => {
    // Arrange
    const updateDto: UpdateEnvironmentDto = {
      token: '1234567890',
      type_environment_id: null,
      payroll_type_environment_id: null,
      eqdocs_type_environment_id: null
    };

    const expectedResponse: UpdateEnvironmentResponseDto = {
      message: 'Ambiente actualizado correctamente',
      company: createMockCompany({
        typeEnvironmentId: null,
        payrollTypeEnvironmentId: null,
        eqdocsTypeEnvironmentId: null,
      }),
    };

    externalApiService.updateEnvironment.mockResolvedValue(expectedResponse);

    // Act
    const result = await useCase.execute(updateDto);

    // Assert
    expect(result).toEqual(expectedResponse);
    expect(externalApiService.updateEnvironment).toHaveBeenCalledWith(updateDto);
    expect(externalApiService.updateEnvironment).toHaveBeenCalledTimes(1);
  });
}); 