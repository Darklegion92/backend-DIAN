import { PayrollPeriod } from '@/catalog/domain/entities/payroll-period.entity';

describe('PayrollPeriod Entity', () => {
  let payrollPeriod: PayrollPeriod;

  beforeEach(() => {
    payrollPeriod = new PayrollPeriod();
  });

  it('should create a payrollPeriod instance', () => {
    expect(payrollPeriod).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testPayrollPeriod = {
      name: 'Mensual',
      code: '01'
    };

    Object.assign(payrollPeriod, testPayrollPeriod);

    expect(payrollPeriod.name).toBe(testPayrollPeriod.name);
    expect(payrollPeriod.code).toBe(testPayrollPeriod.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    payrollPeriod.createdAt = now;
    payrollPeriod.updatedAt = now;

    expect(payrollPeriod.createdAt).toBeDefined();
    expect(payrollPeriod.updatedAt).toBeDefined();
    expect(payrollPeriod.createdAt).toBe(now);
    expect(payrollPeriod.updatedAt).toBe(now);
  });
}); 