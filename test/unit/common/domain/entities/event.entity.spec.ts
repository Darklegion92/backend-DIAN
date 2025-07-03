import { Event } from '@/catalog/domain/entities/event.entity';

describe('Event Entity', () => {
  let event: Event;

  beforeEach(() => {
    event = new Event();
  });

  it('should create an event instance', () => {
    expect(event).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testEvent = {
      name: 'Factura Generada',
      code: '01'
    };

    Object.assign(event, testEvent);

    expect(event.name).toBe(testEvent.name);
    expect(event.code).toBe(testEvent.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    event.createdAt = now;
    event.updatedAt = now;

    expect(event.createdAt).toBeDefined();
    expect(event.updatedAt).toBeDefined();
    expect(event.createdAt).toBe(now);
    expect(event.updatedAt).toBe(now);
  });
}); 