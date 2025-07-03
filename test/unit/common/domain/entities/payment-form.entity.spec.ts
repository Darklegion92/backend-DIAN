import { PaymentForm } from '@/catalog/domain/entities/payment-form.entity';

describe('PaymentForm Entity', () => {
  let paymentForm: PaymentForm;

  beforeEach(() => {
    paymentForm = new PaymentForm();
  });

  it('should create a paymentForm instance', () => {
    expect(paymentForm).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testPaymentForm = {
      name: 'Efectivo',
      code: '01'
    };

    Object.assign(paymentForm, testPaymentForm);

    expect(paymentForm.name).toBe(testPaymentForm.name);
    expect(paymentForm.code).toBe(testPaymentForm.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    paymentForm.createdAt = now;
    paymentForm.updatedAt = now;

    expect(paymentForm.createdAt).toBeDefined();
    expect(paymentForm.updatedAt).toBeDefined();
    expect(paymentForm.createdAt).toBe(now);
    expect(paymentForm.updatedAt).toBe(now);
  });
}); 