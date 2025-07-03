import { Log } from '@/catalog/domain/entities/log.entity';

describe('Log Entity', () => {
  let log: Log;

  beforeEach(() => {
    log = new Log();
  });

  it('should create a log instance', () => {
    expect(log).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testLog = {
      userId: 1,
      payload: { action: 'test', data: 'test data' }
    };

    Object.assign(log, testLog);

    expect(log.userId).toBe(testLog.userId);
    expect(log.payload).toEqual(testLog.payload);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    log.createdAt = now;
    log.updatedAt = now;

    expect(log.createdAt).toBeDefined();
    expect(log.updatedAt).toBeDefined();
    expect(log.createdAt).toBe(now);
    expect(log.updatedAt).toBe(now);
  });
}); 