import { UserDian } from '@/auth/domain/entities/userDian.entity';
import { Company } from '@/company/domain/entities/company.entity';
import { Administrator } from '@/catalog/domain/entities/administrator.entity';

describe('UserDian Entity', () => {
  let userDian: UserDian;
  let company: Company;
  let administrator: Administrator;

  beforeEach(() => {
    userDian = new UserDian();
    company = new Company();
    administrator = new Administrator();
  });

  it('should create a userDian instance', () => {
    expect(userDian).toBeDefined();
  });

  it('should set and get userDian properties correctly', () => {
    const testUserDian = {
      name: 'John Doe',
      email: 'john@example.com',
      emailVerifiedAt: new Date(),
      password: 'hashedPassword123',
      apiToken: 'dian-token-123',
      rememberToken: 'remember-token-123',
      idAdministrator: 1,
      administrator: administrator,
      mailHost: 'smtp.example.com',
      mailPort: '587',
      mailUsername: 'user@example.com',
      mailPassword: 'mail-password',
      mailEncryption: 'tls',
      mailFromAddress: 'noreply@example.com',
      mailFromName: 'System Notifications'
    };

    Object.assign(userDian, testUserDian);

    expect(userDian.name).toBe(testUserDian.name);
    expect(userDian.email).toBe(testUserDian.email);
    expect(userDian.emailVerifiedAt).toBe(testUserDian.emailVerifiedAt);
    expect(userDian.password).toBe(testUserDian.password);
    expect(userDian.apiToken).toBe(testUserDian.apiToken);
    expect(userDian.rememberToken).toBe(testUserDian.rememberToken);
    expect(userDian.mailHost).toBe(testUserDian.mailHost);
    expect(userDian.mailPort).toBe(testUserDian.mailPort);
    expect(userDian.mailUsername).toBe(testUserDian.mailUsername);
    expect(userDian.mailPassword).toBe(testUserDian.mailPassword);
    expect(userDian.mailEncryption).toBe(testUserDian.mailEncryption);
    expect(userDian.mailFromAddress).toBe(testUserDian.mailFromAddress);
    expect(userDian.mailFromName).toBe(testUserDian.mailFromName);
  });

  it('should handle null email verification', () => {
    const testUserDian = {
      name: 'John Doe',
      email: 'john@example.com',
      emailVerifiedAt: null,
      password: 'hashedPassword123',
      apiToken: 'dian-token-123',
      rememberToken: 'remember-token-123',
      idAdministrator: 1,
      administrator: administrator
    };

    Object.assign(userDian, testUserDian);

    expect(userDian.emailVerifiedAt).toBeNull();
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    userDian.createdAt = now;
    userDian.updatedAt = now;

    expect(userDian.createdAt).toBeDefined();
    expect(userDian.updatedAt).toBeDefined();
    expect(userDian.createdAt).toBe(now);
    expect(userDian.updatedAt).toBe(now);
  });

  it('should handle mail configuration changes', () => {
    const mailConfig = {
      mailHost: 'smtp.example.com',
      mailPort: '587',
      mailUsername: 'user@example.com',
      mailPassword: 'mail-password',
      mailEncryption: 'tls',
      mailFromAddress: 'noreply@example.com',
      mailFromName: 'System Notifications'
    };

    Object.assign(userDian, mailConfig);

    expect(userDian.mailHost).toBe(mailConfig.mailHost);
    expect(userDian.mailPort).toBe(mailConfig.mailPort);
    expect(userDian.mailUsername).toBe(mailConfig.mailUsername);
    expect(userDian.mailPassword).toBe(mailConfig.mailPassword);
    expect(userDian.mailEncryption).toBe(mailConfig.mailEncryption);
    expect(userDian.mailFromAddress).toBe(mailConfig.mailFromAddress);
    expect(userDian.mailFromName).toBe(mailConfig.mailFromName);
  });

  it('should handle null mail configuration', () => {
    const mailConfig = {
      mailHost: '',
      mailPort: '',
      mailUsername: '',
      mailPassword: '',
      mailEncryption: '',
      mailFromAddress: null,
      mailFromName: null
    };

    Object.assign(userDian, mailConfig);

    expect(userDian.mailHost).toBe('');
    expect(userDian.mailPort).toBe('');
    expect(userDian.mailUsername).toBe('');
    expect(userDian.mailPassword).toBe('');
    expect(userDian.mailEncryption).toBe('');
    expect(userDian.mailFromAddress).toBeNull();
    expect(userDian.mailFromName).toBeNull();
  });
}); 