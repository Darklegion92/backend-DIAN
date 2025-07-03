import { Software } from '@/software/domain/entities/software.entity';

describe('Software Entity', () => {
  let software: Software;

  beforeEach(() => {
    software = new Software();
  });

  it('should create a software instance', () => {
    expect(software).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testSoftware = {
      companyId: 1,
      identifier: 'SW123',
      pin: '123456',
      url: 'https://example.com'
    };

    Object.assign(software, testSoftware);

    expect(software.companyId).toBe(testSoftware.companyId);
    expect(software.identifier).toBe(testSoftware.identifier);
    expect(software.pin).toBe(testSoftware.pin);
    expect(software.url).toBe(testSoftware.url);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    software.createdAt = now;
    software.updatedAt = now;

    expect(software.createdAt).toBeDefined();
    expect(software.updatedAt).toBeDefined();
    expect(software.createdAt).toBe(now);
    expect(software.updatedAt).toBe(now);
  });
}); 