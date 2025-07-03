import { PaginationQueryDto } from '@/common/application/ports/output/dtos/pagination-query.dto';

describe('PaginationQueryDto', () => {
  let dto: PaginationQueryDto;

  beforeEach(() => {
    dto = new PaginationQueryDto();
  });

  it('debe tener valores por defecto', () => {
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
    expect(dto.sortBy).toBe('createdAt');
    expect(dto.sortOrder).toBe('DESC');
  });

  it('debe permitir establecer valores personalizados', () => {
    dto.page = 2;
    dto.limit = 20;
    dto.sortBy = 'name';
    dto.sortOrder = 'ASC';

    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(20);
    expect(dto.sortBy).toBe('name');
    expect(dto.sortOrder).toBe('ASC');
  });

  describe('getOffset', () => {
    it('debe calcular el offset correctamente con valores por defecto', () => {
      expect(dto.getOffset()).toBe(0); // (1 - 1) * 10 = 0
    });

    it('debe calcular el offset correctamente con página 2', () => {
      dto.page = 2;
      expect(dto.getOffset()).toBe(10); // (2 - 1) * 10 = 10
    });

    it('debe calcular el offset correctamente con límite personalizado', () => {
      dto.limit = 5;
      expect(dto.getOffset()).toBe(0); // (1 - 1) * 5 = 0
    });

    it('debe calcular el offset correctamente con página y límite personalizados', () => {
      dto.page = 3;
      dto.limit = 15;
      expect(dto.getOffset()).toBe(30); // (3 - 1) * 15 = 30
    });

    it('debe manejar valores undefined usando valores por defecto', () => {
      dto.page = undefined;
      dto.limit = undefined;
      expect(dto.getOffset()).toBe(0); // (1 - 1) * 10 = 0
    });
  });

  describe('validaciones', () => {
    it('debe aceptar valores válidos', () => {
      dto.page = 1;
      dto.limit = 50;
      expect(dto.page).toBe(1);
      expect(dto.limit).toBe(50);
    });

    it('debe aceptar el límite máximo', () => {
      dto.limit = 100;
      expect(dto.limit).toBe(100);
    });

    it('debe aceptar valores de ordenamiento válidos', () => {
      dto.sortOrder = 'ASC';
      expect(dto.sortOrder).toBe('ASC');
      
      dto.sortOrder = 'DESC';
      expect(dto.sortOrder).toBe('DESC');
    });
  });
}); 