import { Certificate } from '@/certificates/domain/entities/certificate.entity';
import { Company } from '@/company/domain/entities/company.entity';

describe('Certificate Entity', () => {
  let certificate: Certificate;
  let company: Company;

  beforeEach(() => {
    certificate = new Certificate();
    company = new Company();
  });

  it('should create a certificate instance', () => {
    expect(certificate).toBeDefined();
  });

  it('should set and get certificate properties correctly', () => {
    const testCertificate = {
      companyId: 1,
      name: 'certificado_empresa.p12',
      password: 'certificate-password',
      expirationDate: new Date('2025-12-31'),
      company: company
    };

    Object.assign(certificate, testCertificate);

    expect(certificate.companyId).toBe(testCertificate.companyId);
    expect(certificate.name).toBe(testCertificate.name);
    expect(certificate.password).toBe(testCertificate.password);
    expect(certificate.expirationDate).toBe(testCertificate.expirationDate);
    expect(certificate.company).toBe(testCertificate.company);
  });

  it('should handle null expiration date', () => {
    const testCertificate = {
      companyId: 1,
      name: 'certificado_empresa.p12',
      password: 'certificate-password',
      expirationDate: null,
      company: company
    };

    Object.assign(certificate, testCertificate);

    expect(certificate.expirationDate).toBeNull();
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    certificate.createdAt = now;
    certificate.updatedAt = now;

    expect(certificate.createdAt).toBeDefined();
    expect(certificate.updatedAt).toBeDefined();
    expect(certificate.createdAt).toBe(now);
    expect(certificate.updatedAt).toBe(now);
  });

  it('should handle different company assignments', () => {
    const company1 = new Company();
    const company2 = new Company();

    certificate.company = company1;
    expect(certificate.company).toBe(company1);

    certificate.company = company2;
    expect(certificate.company).toBe(company2);
  });

  it('should handle company ID changes', () => {
    certificate.companyId = 1;
    expect(certificate.companyId).toBe(1);

    certificate.companyId = 2;
    expect(certificate.companyId).toBe(2);
  });

  it('should handle certificate name and password changes', () => {
    certificate.name = 'certificado1.p12';
    certificate.password = 'password1';
    expect(certificate.name).toBe('certificado1.p12');
    expect(certificate.password).toBe('password1');

    certificate.name = 'certificado2.p12';
    certificate.password = 'password2';
    expect(certificate.name).toBe('certificado2.p12');
    expect(certificate.password).toBe('password2');
  });

  it('should handle company relationship changes', () => {
    const company1 = new Company();
    const company2 = new Company();

    certificate.company = company1;
    certificate.companyId = 1;
    expect(certificate.company).toBe(company1);
    expect(certificate.companyId).toBe(1);

    certificate.company = company2;
    certificate.companyId = 2;
    expect(certificate.company).toBe(company2);
    expect(certificate.companyId).toBe(2);
  });
}); 