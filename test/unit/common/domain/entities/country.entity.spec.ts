import { Country } from '@/catalog/domain/entities/country.entity';

describe('Country Entity', () => {
  let country: Country;

  beforeEach(() => {
    country = new Country();
  });

  it('should create a country instance', () => {
    expect(country).toBeDefined();
  });

  it('should set and get country properties correctly', () => {
    const testCountry = {
      name: 'Colombia',
      description: 'República de Colombia',
      state: true
    };

    Object.assign(country, testCountry);

    expect(country.name).toBe(testCountry.name);
    expect(country.description).toBe(testCountry.description);
    expect(country.state).toBe(testCountry.state);
  });

  it('should handle null description', () => {
    const testCountry = {
      name: 'Colombia',
      description: null,
      state: true
    };

    Object.assign(country, testCountry);

    expect(country.description).toBeNull();
  });

  it('should handle state changes', () => {
    country.state = true;
    expect(country.state).toBe(true);

    country.state = false;
    expect(country.state).toBe(false);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    country.createdAt = now;
    country.updatedAt = now;

    expect(country.createdAt).toBeDefined();
    expect(country.updatedAt).toBeDefined();
    expect(country.createdAt).toBe(now);
    expect(country.updatedAt).toBe(now);
  });

  it('should handle name changes', () => {
    country.name = 'Colombia';
    expect(country.name).toBe('Colombia');

    country.name = 'Ecuador';
    expect(country.name).toBe('Ecuador');
  });

  it('should handle description changes', () => {
    country.description = 'República de Colombia';
    expect(country.description).toBe('República de Colombia');

    country.description = 'República del Ecuador';
    expect(country.description).toBe('República del Ecuador');
  });
}); 