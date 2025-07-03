import { TypeDocument } from '@/catalog/domain/entities/type-document.entity';

describe('TypeDocument Entity', () => {
  let typeDocument: TypeDocument;

  beforeEach(() => {
    typeDocument = new TypeDocument();
  });

  it('should create a typeDocument instance', () => {
    expect(typeDocument).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeDocument = {
      name: 'Factura de Venta',
      code: '01'
    };

    Object.assign(typeDocument, testTypeDocument);

    expect(typeDocument.name).toBe(testTypeDocument.name);
    expect(typeDocument.code).toBe(testTypeDocument.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeDocument.createdAt = now;
    typeDocument.updatedAt = now;

    expect(typeDocument.createdAt).toBeDefined();
    expect(typeDocument.updatedAt).toBeDefined();
    expect(typeDocument.createdAt).toBe(now);
    expect(typeDocument.updatedAt).toBe(now);
  });
}); 