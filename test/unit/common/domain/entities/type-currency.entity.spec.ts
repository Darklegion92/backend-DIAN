import { TypeCurrency } from '@/catalog/domain/entities/type-currency.entity';

describe('TypeCurrency Entity', () => { 
  let typeCurrency: TypeCurrency;

  beforeEach(() => {
    typeCurrency = new TypeCurrency();
  });

  it('should create a typeCurrency instance', () => {
    expect(typeCurrency).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeCurrency = {
      name: 'Peso Colombiano',
      code: 'COP'
    };

    Object.assign(typeCurrency, testTypeCurrency);

    expect(typeCurrency.name).toBe(testTypeCurrency.name);
    expect(typeCurrency.code).toBe(testTypeCurrency.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeCurrency.createdAt = now;
    typeCurrency.updatedAt = now;

    expect(typeCurrency.createdAt).toBeDefined();
    expect(typeCurrency.updatedAt).toBeDefined();
    expect(typeCurrency.createdAt).toBe(now);
    expect(typeCurrency.updatedAt).toBe(now);
  });
}); 