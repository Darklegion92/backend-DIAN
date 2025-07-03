import { Discount } from '@/catalog/domain/entities/discount.entity';

describe('Discount Entity', () => {
  let discount: Discount;

  beforeEach(() => {
    discount = new Discount();
  });

  it('should create a discount instance', () => {
    expect(discount).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testDiscount = {
      name: 'Descuento por pronto pago',
      code: '01'
    };

    Object.assign(discount, testDiscount);

    expect(discount.name).toBe(testDiscount.name);
    expect(discount.code).toBe(testDiscount.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    discount.createdAt = now;
    discount.updatedAt = now;

    expect(discount.createdAt).toBeDefined();
    expect(discount.updatedAt).toBeDefined();
    expect(discount.createdAt).toBe(now);
    expect(discount.updatedAt).toBe(now);
  });
}); 