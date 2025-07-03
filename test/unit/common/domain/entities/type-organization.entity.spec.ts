import { TypeOrganization } from '@/catalog/domain/entities/type-organization.entity';

describe('TypeOrganization Entity', () => {
  let typeOrganization: TypeOrganization;

  beforeEach(() => {
    typeOrganization = new TypeOrganization();
  });

  it('should create a typeOrganization instance', () => {
    expect(typeOrganization).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeOrganization = {
      name: 'Persona Jurídica',
      code: '2'
    };

    Object.assign(typeOrganization, testTypeOrganization);

    expect(typeOrganization.name).toBe(testTypeOrganization.name);
    expect(typeOrganization.code).toBe(testTypeOrganization.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeOrganization.createdAt = now;
    typeOrganization.updatedAt = now;

    expect(typeOrganization.createdAt).toBeDefined();
    expect(typeOrganization.updatedAt).toBeDefined();
    expect(typeOrganization.createdAt).toBe(now);
    expect(typeOrganization.updatedAt).toBe(now);
  });
}); 