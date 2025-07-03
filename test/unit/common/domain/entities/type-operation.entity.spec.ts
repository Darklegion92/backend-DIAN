import { TypeOperation } from '@/catalog/domain/entities/type-operation.entity';

describe('TypeOperation Entity', () => {  
  let typeOperation: TypeOperation;

  beforeEach(() => {
    typeOperation = new TypeOperation();
  });

  it('should create a typeOperation instance', () => {
    expect(typeOperation).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeOperation = {
      name: 'Venta',
      code: '01'
    };

    Object.assign(typeOperation, testTypeOperation);

    expect(typeOperation.name).toBe(testTypeOperation.name);
    expect(typeOperation.code).toBe(testTypeOperation.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeOperation.createdAt = now;
    typeOperation.updatedAt = now;

    expect(typeOperation.createdAt).toBeDefined();
    expect(typeOperation.updatedAt).toBeDefined();
    expect(typeOperation.createdAt).toBe(now);
    expect(typeOperation.updatedAt).toBe(now);
  });
}); 