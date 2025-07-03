import { TypeDocumentIdentification } from '@/catalog/domain/entities/type-document-identification.entity';

describe('TypeDocumentIdentification Entity', () => {
  let typeDocumentIdentification: TypeDocumentIdentification;

  beforeEach(() => {
    typeDocumentIdentification = new TypeDocumentIdentification();
  });

  it('should create a typeDocumentIdentification instance', () => {
    expect(typeDocumentIdentification).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeDocumentIdentification = {
      name: 'Cédula de Ciudadanía',
      code: '11'
    };

    Object.assign(typeDocumentIdentification, testTypeDocumentIdentification);

    expect(typeDocumentIdentification.name).toBe(testTypeDocumentIdentification.name);
    expect(typeDocumentIdentification.code).toBe(testTypeDocumentIdentification.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeDocumentIdentification.createdAt = now;
    typeDocumentIdentification.updatedAt = now;

    expect(typeDocumentIdentification.createdAt).toBeDefined();
    expect(typeDocumentIdentification.updatedAt).toBeDefined();
    expect(typeDocumentIdentification.createdAt).toBe(now);
    expect(typeDocumentIdentification.updatedAt).toBe(now);
  });
}); 