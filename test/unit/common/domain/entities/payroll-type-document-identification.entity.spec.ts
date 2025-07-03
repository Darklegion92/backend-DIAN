import { PayrollTypeDocumentIdentification } from '@/catalog/domain/entities/payroll-type-document-identification.entity';

describe('PayrollTypeDocumentIdentification Entity', () => {
  let payrollTypeDocumentIdentification: PayrollTypeDocumentIdentification;

  beforeEach(() => {
    payrollTypeDocumentIdentification = new PayrollTypeDocumentIdentification();
  });

  it('should create a payrollTypeDocumentIdentification instance', () => {
    expect(payrollTypeDocumentIdentification).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testPayrollTypeDocumentIdentification = {
      name: 'Cédula de Ciudadanía',
      code: '11'
    };

    Object.assign(payrollTypeDocumentIdentification, testPayrollTypeDocumentIdentification);

    expect(payrollTypeDocumentIdentification.name).toBe(testPayrollTypeDocumentIdentification.name);
    expect(payrollTypeDocumentIdentification.code).toBe(testPayrollTypeDocumentIdentification.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    payrollTypeDocumentIdentification.createdAt = now;
    payrollTypeDocumentIdentification.updatedAt = now;

    expect(payrollTypeDocumentIdentification.createdAt).toBeDefined();
    expect(payrollTypeDocumentIdentification.updatedAt).toBeDefined();
    expect(payrollTypeDocumentIdentification.createdAt).toBe(now);
    expect(payrollTypeDocumentIdentification.updatedAt).toBe(now);
  });
}); 