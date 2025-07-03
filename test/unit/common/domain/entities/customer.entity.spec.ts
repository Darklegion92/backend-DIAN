import { Customer } from '@/catalog/domain/entities/customer.entity';

describe('Customer Entity', () => {
  let customer: Customer;

  beforeEach(() => {
    customer = new Customer();
  });

  it('should create a customer instance', () => {
    expect(customer).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testCustomer = {
      identificationNumber: '123456789',
      dv: '9',
      name: 'Cliente Ejemplo',
      address: 'Calle 123 #45-67',
      phone: '+57 300 123 4567',
      email: 'cliente@example.com',
      password: 'password123'
    };

    Object.assign(customer, testCustomer);

    expect(customer.identificationNumber).toBe(testCustomer.identificationNumber);
    expect(customer.dv).toBe(testCustomer.dv);
    expect(customer.name).toBe(testCustomer.name);
    expect(customer.address).toBe(testCustomer.address);
    expect(customer.phone).toBe(testCustomer.phone);
    expect(customer.email).toBe(testCustomer.email);
    expect(customer.password).toBe(testCustomer.password);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    customer.createdAt = now;
    customer.updatedAt = now;

    expect(customer.createdAt).toBeDefined();
    expect(customer.updatedAt).toBeDefined();
    expect(customer.createdAt).toBe(now);
    expect(customer.updatedAt).toBe(now);
  });
}); 