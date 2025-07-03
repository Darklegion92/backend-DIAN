import { Send } from '@/catalog/domain/entities/send.entity';

describe('Send Entity', () => {
  let send: Send;

  beforeEach(() => {
    send = new Send();
  });

  it('should create a send instance', () => {
    expect(send).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testSend = {
      companyId: 1,
      typeDocumentId: 1,
      year: 2024,
      nextConsecutive: 1
    };

    Object.assign(send, testSend);

    expect(send.companyId).toBe(testSend.companyId);
    expect(send.typeDocumentId).toBe(testSend.typeDocumentId);
    expect(send.year).toBe(testSend.year);
    expect(send.nextConsecutive).toBe(testSend.nextConsecutive);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    send.createdAt = now;
    send.updatedAt = now;

    expect(send.createdAt).toBeDefined();
    expect(send.updatedAt).toBeDefined();
    expect(send.createdAt).toBe(now);
    expect(send.updatedAt).toBe(now);
  });
}); 