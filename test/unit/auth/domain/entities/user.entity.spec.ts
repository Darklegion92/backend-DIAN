import { User } from '@/auth/domain/entities/user.entity';
import { Role } from '@/auth/domain/enums/role.enum';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
  });

  it('should create a user instance', () => {
    expect(user).toBeDefined();
  });

  it('should set and get user properties correctly', () => {
    const testUser = {
      username: 'testuser',
      password: 'hashedPassword123',
      email: 'test@example.com',
      name: 'Test User',
      role: Role.ADMIN,   
      company_document: '123456789',
      document_person_responsible: '987654321',
      first_name_person_responsible: 'John',
      last_name_person_responsible: 'Doe',
      job_title_person_responsible: 'Developer',
      organization_department_person_responsible: 'IT'
    };

    Object.assign(user, testUser);

    expect(user.username).toBe(testUser.username);
    expect(user.email).toBe(testUser.email);
    expect(user.name).toBe(testUser.name);
    expect(user.role).toBe(testUser.role);
    expect(user.company_document).toBe(testUser.company_document);
    expect(user.document_person_responsible).toBe(testUser.document_person_responsible);
    expect(user.first_name_person_responsible).toBe(testUser.first_name_person_responsible);
    expect(user.last_name_person_responsible).toBe(testUser.last_name_person_responsible);
    expect(user.job_title_person_responsible).toBe(testUser.job_title_person_responsible);
    expect(user.organization_department_person_responsible).toBe(testUser.organization_department_person_responsible);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    user.createdAt = now;
    user.updatedAt = now;

    expect(user.createdAt).toBeDefined();
    expect(user.updatedAt).toBeDefined();
    expect(user.createdAt).toBe(now);
    expect(user.updatedAt).toBe(now);
  });
}); 