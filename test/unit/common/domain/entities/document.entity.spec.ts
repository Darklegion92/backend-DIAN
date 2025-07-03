import { Document } from '@/catalog/domain/entities/document.entity';

describe('Document Entity', () => {
  let document: Document;

  beforeEach(() => {
    document = new Document();
  });

  it('should create a document instance', () => {
    expect(document).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testDocument = {
      identificationNumber: '123456789',
      stateDocumentId: 1,
      typeDocumentId: 1,
      customer: '123456789',
      prefix: 'FC',
      number: '001',
      clientId: '456',
      currencyId: 1,
      dateIssue: new Date(),
      sale: 1000,
      totalDiscount: 0,
      totalTax: 190,
      subtotal: 1000,
      total: 1190,
      versionUblId: 1,
      ambientId: 1,
      aceptacion: false,
      sendEmailSuccess: false
    };

    Object.assign(document, testDocument);

    expect(document.identificationNumber).toBe(testDocument.identificationNumber);
    expect(document.stateDocumentId).toBe(testDocument.stateDocumentId);
    expect(document.typeDocumentId).toBe(testDocument.typeDocumentId);
    expect(document.customer).toBe(testDocument.customer);
    expect(document.prefix).toBe(testDocument.prefix);
    expect(document.number).toBe(testDocument.number);
    expect(document.clientId).toBe(testDocument.clientId);
    expect(document.currencyId).toBe(testDocument.currencyId);
    expect(document.dateIssue).toBe(testDocument.dateIssue);
    expect(document.sale).toBe(testDocument.sale);
    expect(document.totalDiscount).toBe(testDocument.totalDiscount);
    expect(document.totalTax).toBe(testDocument.totalTax);
    expect(document.subtotal).toBe(testDocument.subtotal);
    expect(document.total).toBe(testDocument.total);
    expect(document.versionUblId).toBe(testDocument.versionUblId);
    expect(document.ambientId).toBe(testDocument.ambientId);
    expect(document.aceptacion).toBe(testDocument.aceptacion);
    expect(document.sendEmailSuccess).toBe(testDocument.sendEmailSuccess);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    document.createdAt = now;
    document.updatedAt = now;

    expect(document.createdAt).toBeDefined();
    expect(document.updatedAt).toBeDefined();
    expect(document.createdAt).toBe(now);
    expect(document.updatedAt).toBe(now);
  });
}); 