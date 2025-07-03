import { TypeEnvironment } from '@/catalog/domain/entities/type-environment.entity';

describe('TypeEnvironment Entity', () => {
  let typeEnvironment: TypeEnvironment;

  beforeEach(() => {
    typeEnvironment = new TypeEnvironment();
  });

  it('should create a typeEnvironment instance', () => {
    expect(typeEnvironment).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeEnvironment = {
      name: 'Producción',
      code: '2'
    };

    Object.assign(typeEnvironment, testTypeEnvironment);

    expect(typeEnvironment.name).toBe(testTypeEnvironment.name);
    expect(typeEnvironment.code).toBe(testTypeEnvironment.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeEnvironment.createdAt = now;
    typeEnvironment.updatedAt = now;

    expect(typeEnvironment.createdAt).toBeDefined();
    expect(typeEnvironment.updatedAt).toBeDefined();
    expect(typeEnvironment.createdAt).toBe(now);
    expect(typeEnvironment.updatedAt).toBe(now);
  });
}); 