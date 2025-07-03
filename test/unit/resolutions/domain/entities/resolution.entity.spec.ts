import { Resolution } from '@/resolutions/domain/entities/resolution.entity';

describe('Resolution Entity', () => {
  let resolution: Resolution;

  beforeEach(() => {
    resolution = new Resolution();
  });

  it('should create a resolution instance', () => {
    expect(resolution).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testResolution = {
      companyId: 1,
      typeDocumentId: 1,
      prefix: 'RES',
      resolution: '18760000001',
      resolutionDate: new Date('2024-01-01'),
      technicalKey: 'abc123def456',
      from: 1,
      to: 1000,
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-12-31')
    };

    Object.assign(resolution, testResolution);

    expect(resolution.companyId).toBe(testResolution.companyId);
    expect(resolution.typeDocumentId).toBe(testResolution.typeDocumentId);
    expect(resolution.prefix).toBe(testResolution.prefix);
    expect(resolution.resolution).toBe(testResolution.resolution);
    expect(resolution.resolutionDate).toBe(testResolution.resolutionDate);
    expect(resolution.technicalKey).toBe(testResolution.technicalKey);
    expect(resolution.from).toBe(testResolution.from);
    expect(resolution.to).toBe(testResolution.to);
    expect(resolution.dateFrom).toBe(testResolution.dateFrom);
    expect(resolution.dateTo).toBe(testResolution.dateTo);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    resolution.createdAt = now;
    resolution.updatedAt = now;

    expect(resolution.createdAt).toBeDefined();
    expect(resolution.updatedAt).toBeDefined();
    expect(resolution.createdAt).toBe(now);
    expect(resolution.updatedAt).toBe(now);
  });
}); 