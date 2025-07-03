import { TypeWorker } from '@/catalog/domain/entities/type-worker.entity';

describe('TypeWorker Entity', () => {
  let typeWorker: TypeWorker;

  beforeEach(() => {
    typeWorker = new TypeWorker();
  });

  it('should create a typeWorker instance', () => {
    expect(typeWorker).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeWorker = {
      name: 'Dependiente',
      code: '01'
    };

    Object.assign(typeWorker, testTypeWorker);

    expect(typeWorker.name).toBe(testTypeWorker.name);
    expect(typeWorker.code).toBe(testTypeWorker.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeWorker.createdAt = now;
    typeWorker.updatedAt = now;

    expect(typeWorker.createdAt).toBeDefined();
    expect(typeWorker.updatedAt).toBeDefined();
    expect(typeWorker.createdAt).toBe(now);
    expect(typeWorker.updatedAt).toBe(now);
  });
}); 