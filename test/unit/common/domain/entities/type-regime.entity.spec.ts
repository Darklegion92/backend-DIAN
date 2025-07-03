import { TypeRegime } from '@/catalog/domain/entities/type-regime.entity';

describe('TypeRegime Entity', () => { 
  let typeRegime: TypeRegime;

  beforeEach(() => {
    typeRegime = new TypeRegime();
  });

  it('should create a typeRegime instance', () => {
    expect(typeRegime).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeRegime = {
      name: 'Común',
      code: '2'
    };

    Object.assign(typeRegime, testTypeRegime);

    expect(typeRegime.name).toBe(testTypeRegime.name);
    expect(typeRegime.code).toBe(testTypeRegime.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeRegime.createdAt = now;
    typeRegime.updatedAt = now;

    expect(typeRegime.createdAt).toBeDefined();
    expect(typeRegime.updatedAt).toBeDefined();
    expect(typeRegime.createdAt).toBe(now);
    expect(typeRegime.updatedAt).toBe(now);
  });
}); 