import { TypeRejection } from '@/catalog/domain/entities/type-rejection.entity';

describe('TypeRejection Entity', () => {
  let typeRejection: TypeRejection;

  beforeEach(() => {
    typeRejection = new TypeRejection();
  });

  it('should create a typeRejection instance', () => {
    expect(typeRejection).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeRejection = {
      name: 'Rechazo por validación',
      code: '01'
    };

    Object.assign(typeRejection, testTypeRejection);

    expect(typeRejection.name).toBe(testTypeRejection.name);
    expect(typeRejection.code).toBe(testTypeRejection.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeRejection.createdAt = now;
    typeRejection.updatedAt = now;

    expect(typeRejection.createdAt).toBeDefined();
    expect(typeRejection.updatedAt).toBeDefined();
    expect(typeRejection.createdAt).toBe(now);
    expect(typeRejection.updatedAt).toBe(now);
  });
}); 