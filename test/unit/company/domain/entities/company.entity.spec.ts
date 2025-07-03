import { Company } from '@/company/domain/entities/company.entity';
import { User } from '@/auth/domain/entities/user.entity';
import { UserDian } from '@/auth/domain/entities/userDian.entity';

describe('Company Entity', () => {
  let company: Company;
  let user: User;
  let userDian: UserDian;

  beforeEach(() => {
    company = new Company();
    user = new User();
    userDian = new UserDian();
  });

  it('should create a company instance', () => {
    expect(company).toBeDefined();
  });

  it('should set and get company properties correctly', () => {
    const testCompany = {
      identificationNumber: '900123456-7',
      name: 'Empresa Ejemplo S.A.S.',
      dv: '7',
      typeDocumentIdentificationId: 6,
      typeOrganizationId: 2,
      languageId: 79,
      taxId: 1,
      typeOperationId: 2,
      typeRegimeId: 2,
      typeLiabilityId: 14,
      municipalityId: 149,
      typeEnvironmentId: 1,
      payrollTypeEnvironmentId: 1,
      eqdocsTypeEnvironmentId: 1,
      address: 'Calle 123 #45-67',
      phone: '+57 300 123 4567',
      email: 'contacto@empresa.com',
      merchantRegistration: '12345678',
      state: true,
      password: 'company-password',
      allowSellerLogin: false,
      imapServer: 'smtp.gmail.com',
      imapPort: '587',
      imapUser: 'empresa@gmail.com',
      imapPassword: 'imap-password',
      imapEncryption: 'tls',
      soltecUserId: 'uuid-string-here',
      soltecUser: user,
      userId: 1,
      user: userDian
    };

    Object.assign(company, testCompany);

    expect(company.identificationNumber).toBe(testCompany.identificationNumber);
    expect(company.name).toBe(testCompany.name);
    expect(company.dv).toBe(testCompany.dv);
    expect(company.typeDocumentIdentificationId).toBe(testCompany.typeDocumentIdentificationId);
    expect(company.typeOrganizationId).toBe(testCompany.typeOrganizationId);
    expect(company.languageId).toBe(testCompany.languageId);
    expect(company.taxId).toBe(testCompany.taxId);
    expect(company.typeOperationId).toBe(testCompany.typeOperationId);
    expect(company.typeRegimeId).toBe(testCompany.typeRegimeId);
    expect(company.typeLiabilityId).toBe(testCompany.typeLiabilityId);
    expect(company.municipalityId).toBe(testCompany.municipalityId);
    expect(company.typeEnvironmentId).toBe(testCompany.typeEnvironmentId);
    expect(company.payrollTypeEnvironmentId).toBe(testCompany.payrollTypeEnvironmentId);
    expect(company.eqdocsTypeEnvironmentId).toBe(testCompany.eqdocsTypeEnvironmentId);
    expect(company.address).toBe(testCompany.address);
    expect(company.phone).toBe(testCompany.phone);
    expect(company.email).toBe(testCompany.email);
    expect(company.merchantRegistration).toBe(testCompany.merchantRegistration);
    expect(company.state).toBe(testCompany.state);
    expect(company.password).toBe(testCompany.password);
    expect(company.allowSellerLogin).toBe(testCompany.allowSellerLogin);
    expect(company.imapServer).toBe(testCompany.imapServer);
    expect(company.imapPort).toBe(testCompany.imapPort);
    expect(company.imapUser).toBe(testCompany.imapUser);
    expect(company.imapPassword).toBe(testCompany.imapPassword);
    expect(company.imapEncryption).toBe(testCompany.imapEncryption);
    expect(company.soltecUserId).toBe(testCompany.soltecUserId);
    expect(company.soltecUser).toBe(testCompany.soltecUser);
    expect(company.userId).toBe(testCompany.userId);
    expect(company.user).toBe(testCompany.user);
  });

  it('should handle empty user assignments', () => {
    company.soltecUserId = '';
    company.soltecUser = new User();
    company.userId = 0;
    company.user = new UserDian();

    expect(company.soltecUserId).toBe('');
    expect(company.soltecUser).toBeDefined();
    expect(company.userId).toBe(0);
    expect(company.user).toBeDefined();
  });

  it('should handle different user assignments', () => {
    const user1 = new User();
    const user2 = new User();
    const userDian1 = new UserDian();
    const userDian2 = new UserDian();

    company.soltecUser = user1;
    company.user = userDian1;
    expect(company.soltecUser).toBe(user1);
    expect(company.user).toBe(userDian1);

    company.soltecUser = user2;
    company.user = userDian2;
    expect(company.soltecUser).toBe(user2);
    expect(company.user).toBe(userDian2);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    company.createdAt = now;
    company.updatedAt = now;

    expect(company.createdAt).toBeDefined();
    expect(company.updatedAt).toBeDefined();
    expect(company.createdAt).toBe(now);
    expect(company.updatedAt).toBe(now);
  });

  it('should handle state changes', () => {
    company.state = true;
    expect(company.state).toBe(true);

    company.state = false;
    expect(company.state).toBe(false);
  });

  it('should handle user relationship changes', () => {
    const user1 = new User();
    const user2 = new User();
    const userDian1 = new UserDian();
    const userDian2 = new UserDian();

    company.soltecUser = user1;
    company.soltecUserId = 'uuid1';
    company.user = userDian1;
    company.userId = 1;
    expect(company.soltecUser).toBe(user1);
    expect(company.soltecUserId).toBe('uuid1');
    expect(company.user).toBe(userDian1);
    expect(company.userId).toBe(1);

    company.soltecUser = user2;
    company.soltecUserId = 'uuid2';
    company.user = userDian2;
    company.userId = 2;
    expect(company.soltecUser).toBe(user2);
    expect(company.soltecUserId).toBe('uuid2');
    expect(company.user).toBe(userDian2);
    expect(company.userId).toBe(2);
  });
}); 