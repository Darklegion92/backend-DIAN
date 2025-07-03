import { TypeDiscount } from '@/catalog/domain/entities/type-discount.entity';

describe('TypeDiscount Entity', () => {
  let typeDiscount: TypeDiscount;

  beforeEach(() => {
    typeDiscount = new TypeDiscount();
  });

  it('should create a typeDiscount instance', () => {
    expect(typeDiscount).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeDiscount = {
      name: 'Descuento por pronto pago',
      code: '01'
    };

    Object.assign(typeDiscount, testTypeDiscount);

    expect(typeDiscount.name).toBe(testTypeDiscount.name);
    expect(typeDiscount.code).toBe(testTypeDiscount.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeDiscount.createdAt = now;
    typeDiscount.updatedAt = now;

    expect(typeDiscount.createdAt).toBeDefined();
    expect(typeDiscount.updatedAt).toBeDefined();
    expect(typeDiscount.createdAt).toBe(now);
    expect(typeDiscount.updatedAt).toBe(now);
  });
}); 