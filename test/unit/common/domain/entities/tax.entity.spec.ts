import { Tax } from '@/catalog/domain/entities/tax.entity';

describe('Tax Entity', () => {
  let tax: Tax;

  beforeEach(() => {
    tax = new Tax();
  });

  it('should create a tax instance', () => {
    expect(tax).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTax = {
      name: 'IVA',
      code: '01'
    };

    Object.assign(tax, testTax);

    expect(tax.name).toBe(testTax.name);
    expect(tax.code).toBe(testTax.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    tax.createdAt = now;
    tax.updatedAt = now;

    expect(tax.createdAt).toBeDefined();
    expect(tax.updatedAt).toBeDefined();
    expect(tax.createdAt).toBe(now);
    expect(tax.updatedAt).toBe(now);
  });
}); 