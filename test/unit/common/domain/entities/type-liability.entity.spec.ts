import { TypeLiability } from '@/catalog/domain/entities/type-liability.entity';

describe('TypeLiability Entity', () => {
  let typeLiability: TypeLiability;

  beforeEach(() => {
    typeLiability = new TypeLiability();
  });

  it('should create a typeLiability instance', () => {
    expect(typeLiability).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeLiability = {
      name: 'IVA Régimen Común',
      code: '14'
    };

    Object.assign(typeLiability, testTypeLiability);

    expect(typeLiability.name).toBe(testTypeLiability.name);
    expect(typeLiability.code).toBe(testTypeLiability.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeLiability.createdAt = now;
    typeLiability.updatedAt = now;

    expect(typeLiability.createdAt).toBeDefined();
    expect(typeLiability.updatedAt).toBeDefined();
    expect(typeLiability.createdAt).toBe(now);
    expect(typeLiability.updatedAt).toBe(now);
  });
}); 