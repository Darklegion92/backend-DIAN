import { PaymentMethod } from '@/catalog/domain/entities/payment-method.entity';

describe('PaymentMethod Entity', () => {
  let paymentMethod: PaymentMethod;

  beforeEach(() => {
    paymentMethod = new PaymentMethod();
  });

  it('should create a paymentMethod instance', () => {
    expect(paymentMethod).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testPaymentMethod = {
      name: 'Transferencia Bancaria',
      code: '01'
    };

    Object.assign(paymentMethod, testPaymentMethod);

    expect(paymentMethod.name).toBe(testPaymentMethod.name);
    expect(paymentMethod.code).toBe(testPaymentMethod.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    paymentMethod.createdAt = now;
    paymentMethod.updatedAt = now;

    expect(paymentMethod.createdAt).toBeDefined();
    expect(paymentMethod.updatedAt).toBeDefined();
    expect(paymentMethod.createdAt).toBe(now);
    expect(paymentMethod.updatedAt).toBe(now);
  });
}); 