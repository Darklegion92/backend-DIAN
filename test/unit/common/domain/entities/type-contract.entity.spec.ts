import { TypeContract } from '@/catalog/domain/entities/type-contract.entity';

describe('TypeContract Entity', () => {
  let typeContract: TypeContract;

  beforeEach(() => {
    typeContract = new TypeContract();
  });

  it('should create a typeContract instance', () => {
    expect(typeContract).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypeContract = {
      name: 'Contrato a Término Fijo',
      code: '01'
    };

    Object.assign(typeContract, testTypeContract);

    expect(typeContract.name).toBe(testTypeContract.name);
    expect(typeContract.code).toBe(testTypeContract.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typeContract.createdAt = now;
    typeContract.updatedAt = now;

    expect(typeContract.createdAt).toBeDefined();
    expect(typeContract.updatedAt).toBeDefined();
    expect(typeContract.createdAt).toBe(now);
    expect(typeContract.updatedAt).toBe(now);
  });
}); 