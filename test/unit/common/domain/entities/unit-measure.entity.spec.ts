import { UnitMeasure } from '@/catalog/domain/entities/unit-measure.entity';

describe('UnitMeasure Entity', () => {
  let unitMeasure: UnitMeasure;

  beforeEach(() => {
    unitMeasure = new UnitMeasure();
  });

  it('should create a unitMeasure instance', () => {
    expect(unitMeasure).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testUnitMeasure = {
      name: 'Unidad',
      code: 'UND'
    };

    Object.assign(unitMeasure, testUnitMeasure);

    expect(unitMeasure.name).toBe(testUnitMeasure.name);
    expect(unitMeasure.code).toBe(testUnitMeasure.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    unitMeasure.createdAt = now;
    unitMeasure.updatedAt = now;

    expect(unitMeasure.createdAt).toBeDefined();
    expect(unitMeasure.updatedAt).toBeDefined();
    expect(unitMeasure.createdAt).toBe(now);
    expect(unitMeasure.updatedAt).toBe(now);
  });
}); 