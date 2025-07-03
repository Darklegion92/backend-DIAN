import { Department } from '@/catalog/domain/entities/department.entity';

describe('Department Entity', () => {
  let department: Department;

  beforeEach(() => {
    department = new Department();
  });

  it('should create a department instance', () => {
    expect(department).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testDepartment = {
      name: 'Cundinamarca',
      code: '11',
      countryId: 'CO'
    };

    Object.assign(department, testDepartment);

    expect(department.name).toBe(testDepartment.name);
    expect(department.code).toBe(testDepartment.code);
    expect(department.countryId).toBe(testDepartment.countryId);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    department.createdAt = now;
    department.updatedAt = now;

    expect(department.createdAt).toBeDefined();
    expect(department.updatedAt).toBeDefined();
    expect(department.createdAt).toBe(now);
    expect(department.updatedAt).toBe(now);
  });
}); 