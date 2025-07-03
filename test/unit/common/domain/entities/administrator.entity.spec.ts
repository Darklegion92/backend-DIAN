import { Administrator } from '@/catalog/domain/entities/administrator.entity';

describe('Administrator Entity', () => {
  let administrator: Administrator;

  beforeEach(() => {
    administrator = new Administrator();
  });

  it('should create an administrator instance', () => {
    expect(administrator).toBeDefined();
  });

  it('should set and get administrator properties correctly', () => {
    const testAdministrator = {
      identificationNumber: '123456789',
      dv: '9',
      name: 'Juan Pérez',
      address: 'Calle 123 #45-67',
      phone: '+57 300 123 4567',
      email: 'admin@example.com',
      contactName: 'María García',
      password: 'hashedPassword123',
      plan: 'premium',
      state: true,
      observation: 'Administrador principal del sistema'
    };

    Object.assign(administrator, testAdministrator);

    expect(administrator.identificationNumber).toBe(testAdministrator.identificationNumber);
    expect(administrator.dv).toBe(testAdministrator.dv);
    expect(administrator.name).toBe(testAdministrator.name);
    expect(administrator.address).toBe(testAdministrator.address);
    expect(administrator.phone).toBe(testAdministrator.phone);
    expect(administrator.email).toBe(testAdministrator.email);
    expect(administrator.contactName).toBe(testAdministrator.contactName);
    expect(administrator.password).toBe(testAdministrator.password);
    expect(administrator.plan).toBe(testAdministrator.plan);
    expect(administrator.state).toBe(testAdministrator.state);
    expect(administrator.observation).toBe(testAdministrator.observation);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    administrator.createdAt = now;
    administrator.updatedAt = now;

    expect(administrator.createdAt).toBeDefined();
    expect(administrator.updatedAt).toBeDefined();
    expect(administrator.createdAt).toBe(now);
    expect(administrator.updatedAt).toBe(now);
  });
}); 