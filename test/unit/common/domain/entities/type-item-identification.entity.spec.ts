import { TypeItemIdentification } from '@/catalog/domain/entities/type-item-identification.entity';

describe('TypeItemIdentification Entity', () => {
  let typeItemIdentification: TypeItemIdentification;

  beforeEach(() => {
    typeItemIdentification = new TypeItemIdentification();
  });

  it('should create a typeItemIdentification instance', () => {
    expect(typeItemIdentification).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeItemIdentification = {
      name: 'Servicio',
      code: '01'
    };

    Object.assign(typeItemIdentification, testTypeItemIdentification);

    expect(typeItemIdentification.name).toBe(testTypeItemIdentification.name);
    expect(typeItemIdentification.code).toBe(testTypeItemIdentification.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeItemIdentification.createdAt = now;
    typeItemIdentification.updatedAt = now;

    expect(typeItemIdentification.createdAt).toBeDefined();
    expect(typeItemIdentification.updatedAt).toBeDefined();
    expect(typeItemIdentification.createdAt).toBe(now);
    expect(typeItemIdentification.updatedAt).toBe(now);
  });
}); 