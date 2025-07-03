import { ReceivedDocument } from '@/catalog/domain/entities/received-document.entity';

describe('ReceivedDocument Entity', () => {
  let receivedDocument: ReceivedDocument;

  beforeEach(() => {
    receivedDocument = new ReceivedDocument();
  });

  it('should create a receivedDocument instance', () => {
    expect(receivedDocument).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testReceivedDocument = {
      identificationNumber: 123456789,
      dv: '9',
      nameSeller: 'Vendedor Ejemplo',
      stateDocumentId: 1,
      typeDocumentId: 1,
      customer: '123456789',
      prefix: 'FC',
      number: '001',
      dateIssue: new Date(),
      sale: 1000.00,
      subtotal: 1000.00,
      total: 1190.00,
      totalDiscount: 0.00,
      totalTax: 190.00,
      ambientId: 1,
      acuRecibo: false,
      recBienes: false,
      aceptacion: false,
      rechazo: false,
      customerName: 'Cliente Ejemplo'
    };

    Object.assign(receivedDocument, testReceivedDocument);

    expect(receivedDocument.identificationNumber).toBe(testReceivedDocument.identificationNumber);
    expect(receivedDocument.dv).toBe(testReceivedDocument.dv);
    expect(receivedDocument.nameSeller).toBe(testReceivedDocument.nameSeller);
    expect(receivedDocument.stateDocumentId).toBe(testReceivedDocument.stateDocumentId);
    expect(receivedDocument.typeDocumentId).toBe(testReceivedDocument.typeDocumentId);
    expect(receivedDocument.customer).toBe(testReceivedDocument.customer);
    expect(receivedDocument.prefix).toBe(testReceivedDocument.prefix);
    expect(receivedDocument.number).toBe(testReceivedDocument.number);
    expect(receivedDocument.dateIssue).toBe(testReceivedDocument.dateIssue);
    expect(receivedDocument.sale).toBe(testReceivedDocument.sale);
    expect(receivedDocument.subtotal).toBe(testReceivedDocument.subtotal);
    expect(receivedDocument.total).toBe(testReceivedDocument.total);
    expect(receivedDocument.totalDiscount).toBe(testReceivedDocument.totalDiscount);
    expect(receivedDocument.totalTax).toBe(testReceivedDocument.totalTax);
    expect(receivedDocument.ambientId).toBe(testReceivedDocument.ambientId);
    expect(receivedDocument.acuRecibo).toBe(testReceivedDocument.acuRecibo);
    expect(receivedDocument.recBienes).toBe(testReceivedDocument.recBienes);
    expect(receivedDocument.aceptacion).toBe(testReceivedDocument.aceptacion);
    expect(receivedDocument.rechazo).toBe(testReceivedDocument.rechazo);
    expect(receivedDocument.customerName).toBe(testReceivedDocument.customerName);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    receivedDocument.createdAt = now;
    receivedDocument.updatedAt = now;

    expect(receivedDocument.createdAt).toBeDefined();
    expect(receivedDocument.updatedAt).toBeDefined();
    expect(receivedDocument.createdAt).toBe(now);
    expect(receivedDocument.updatedAt).toBe(now);
  });
}); 