import { Language } from '@/catalog/domain/entities/language.entity';

describe('Language Entity', () => {
  let language: Language;

  beforeEach(() => {
    language = new Language();
  });

  it('should create a language instance', () => {
    expect(language).toBeDefined();
  });

  it('should set and get properties correctly', () => {
    const testLanguage = {
      name: 'Español',
      code: 'es'
    };

    Object.assign(language, testLanguage);

    expect(language.name).toBe(testLanguage.name);
    expect(language.code).toBe(testLanguage.code);
  });

  it('should have timestamps after creation', () => {
    const now = new Date();
    language.createdAt = now;
    language.updatedAt = now;

    expect(language.createdAt).toBeDefined();
    expect(language.updatedAt).toBeDefined();
    expect(language.createdAt).toBe(now);
    expect(language.updatedAt).toBe(now);
  });
}); 