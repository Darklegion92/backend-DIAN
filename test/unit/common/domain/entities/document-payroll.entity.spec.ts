import { DocumentPayroll } from '@/catalog/domain/entities/document-payroll.entity';

describe('DocumentPayroll Entity', () => {
  let documentPayroll: DocumentPayroll;

  beforeEach(() => {
    documentPayroll = new DocumentPayroll();
  });

  it('should create a documentPayroll instance', () => {
    expect(documentPayroll).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testDocumentPayroll = {
      identificationNumber: 123456789,
      stateDocumentId: 1,
      typeDocumentId: 1,
      prefix: 'NOM',
      consecutive: '001',
      xml: '<xml>test</xml>',
      pdf: 'base64pdf',
      cune: 'cune123',
      employeeId: '456',
      dateIssue: new Date('2024-01-01'),
      accruedTotal: 1000000,
      deductionsTotal: 100000,
      totalPayroll: 900000,
      requestApi: { test: 'data' }
    };

    Object.assign(documentPayroll, testDocumentPayroll);

    expect(documentPayroll.identificationNumber).toBe(testDocumentPayroll.identificationNumber);
    expect(documentPayroll.stateDocumentId).toBe(testDocumentPayroll.stateDocumentId);
    expect(documentPayroll.typeDocumentId).toBe(testDocumentPayroll.typeDocumentId);
    expect(documentPayroll.prefix).toBe(testDocumentPayroll.prefix);
    expect(documentPayroll.consecutive).toBe(testDocumentPayroll.consecutive);
    expect(documentPayroll.xml).toBe(testDocumentPayroll.xml);
    expect(documentPayroll.pdf).toBe(testDocumentPayroll.pdf);
    expect(documentPayroll.cune).toBe(testDocumentPayroll.cune);
    expect(documentPayroll.employeeId).toBe(testDocumentPayroll.employeeId);
    expect(documentPayroll.dateIssue).toBe(testDocumentPayroll.dateIssue);
    expect(documentPayroll.accruedTotal).toBe(testDocumentPayroll.accruedTotal);
    expect(documentPayroll.deductionsTotal).toBe(testDocumentPayroll.deductionsTotal);
    expect(documentPayroll.totalPayroll).toBe(testDocumentPayroll.totalPayroll);
    expect(documentPayroll.requestApi).toEqual(testDocumentPayroll.requestApi);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    documentPayroll.createdAt = now;
    documentPayroll.updatedAt = now;

    expect(documentPayroll.createdAt).toBeDefined();
    expect(documentPayroll.updatedAt).toBeDefined();
    expect(documentPayroll.createdAt).toBe(now);
    expect(documentPayroll.updatedAt).toBe(now);
  });
}); 