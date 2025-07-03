import { Municipality } from '@/catalog/domain/entities/municipality.entity';

describe('Municipality Entity', () => {
  let municipality: Municipality;

  beforeEach(() => {
    municipality = new Municipality();
  });

  it('should create a municipality instance', () => {
    expect(municipality).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testMunicipality = {
      name: 'Bogotá',
      code: '11001',
      departmentId: '11'
    };

    Object.assign(municipality, testMunicipality);

    expect(municipality.name).toBe(testMunicipality.name);
    expect(municipality.code).toBe(testMunicipality.code);
    expect(municipality.departmentId).toBe(testMunicipality.departmentId);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    municipality.createdAt = now;
    municipality.updatedAt = now;

    expect(municipality.createdAt).toBeDefined();
    expect(municipality.updatedAt).toBeDefined();
    expect(municipality.createdAt).toBe(now);
    expect(municipality.updatedAt).toBe(now);
  });
}); 