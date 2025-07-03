import { TypePlan } from '@/catalog/domain/entities/type-plan.entity';

describe('TypePlan Entity', () => {
  let typePlan: TypePlan;

  beforeEach(() => {
    typePlan = new TypePlan();
  });

  it('should create a typePlan instance', () => {
    expect(typePlan).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testTypePlan = {
      name: 'Plan Básico',
      qtyDocsInvoice: 100,
      qtyDocsPayroll: 50,
      period: 30,
      state: true,
      observations: 'Plan básico con funcionalidades limitadas'
    };

    Object.assign(typePlan, testTypePlan);

    expect(typePlan.name).toBe(testTypePlan.name);
    expect(typePlan.qtyDocsInvoice).toBe(testTypePlan.qtyDocsInvoice);
    expect(typePlan.qtyDocsPayroll).toBe(testTypePlan.qtyDocsPayroll);
    expect(typePlan.period).toBe(testTypePlan.period);
    expect(typePlan.state).toBe(testTypePlan.state);
    expect(typePlan.observations).toBe(testTypePlan.observations);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    typePlan.createdAt = now;
    typePlan.updatedAt = now;

    expect(typePlan.createdAt).toBeDefined();
    expect(typePlan.updatedAt).toBeDefined();
    expect(typePlan.createdAt).toBe(now);
    expect(typePlan.updatedAt).toBe(now);
  });
}); 