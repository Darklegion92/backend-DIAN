import { Employee } from '@/catalog/domain/entities/employee.entity';

describe('Employee Entity', () => {
  let employee: Employee;

  beforeEach(() => {
    employee = new Employee();
  });

  it('should create an employee instance', () => {
    expect(employee).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testEmployee = {
      identificationNumber: '123456789',
      firstName: 'Juan',
      middleName: 'Carlos',
      surname: 'Pérez',
      secondSurname: 'García',
      address: 'Calle 123 #45-67',
      email: 'juan.perez@example.com',
      password: 'password123',
      newPassword: 'newpassword123'
    };

    Object.assign(employee, testEmployee);

    expect(employee.identificationNumber).toBe(testEmployee.identificationNumber);
    expect(employee.firstName).toBe(testEmployee.firstName);
    expect(employee.middleName).toBe(testEmployee.middleName);
    expect(employee.surname).toBe(testEmployee.surname);
    expect(employee.secondSurname).toBe(testEmployee.secondSurname);
    expect(employee.address).toBe(testEmployee.address);
    expect(employee.email).toBe(testEmployee.email);
    expect(employee.password).toBe(testEmployee.password);
    expect(employee.newPassword).toBe(testEmployee.newPassword);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    employee.createdAt = now;
    employee.updatedAt = now;

    expect(employee.createdAt).toBeDefined();
    expect(employee.updatedAt).toBeDefined();
    expect(employee.createdAt).toBe(now);
    expect(employee.updatedAt).toBe(now);
  });
}); 