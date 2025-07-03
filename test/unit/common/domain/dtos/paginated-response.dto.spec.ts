import { PaginationMetaDto, PaginatedResponseDto } from '@/common/application/ports/output/dtos/paginated-response.dto';

describe('PaginationMetaDto', () => {
  it('debería crear una instancia válida con todos los campos', () => {
    const meta = new PaginationMetaDto();
    meta.currentPage = 1;
    meta.itemsPerPage = 10;
    meta.totalItems = 25;
    meta.totalPages = 3;
    meta.hasPreviousPage = false;
    meta.hasNextPage = true;

    expect(meta.currentPage).toBe(1);
    expect(meta.itemsPerPage).toBe(10);
    expect(meta.totalItems).toBe(25);
    expect(meta.totalPages).toBe(3);
    expect(meta.hasPreviousPage).toBe(false);
    expect(meta.hasNextPage).toBe(true);
  });

  it('debería mantener la estructura correcta del objeto', () => {
    const meta = new PaginationMetaDto();
    meta.currentPage = 1;
    meta.itemsPerPage = 10;
    meta.totalItems = 25;
    meta.totalPages = 3;
    meta.hasPreviousPage = false;
    meta.hasNextPage = true;

    const expectedKeys = [
      'currentPage',
      'itemsPerPage',
      'totalItems',
      'totalPages',
      'hasPreviousPage',
      'hasNextPage'
    ];

    expect(Object.keys(meta).sort()).toEqual(expectedKeys.sort());
  });
});

describe('PaginatedResponseDto', () => {
  it('debería crear una instancia válida con el método constructor', () => {
    const data = ['item1', 'item2', 'item3'];
    const meta = new PaginationMetaDto();
    meta.currentPage = 1;
    meta.itemsPerPage = 10;
    meta.totalItems = 25;
    meta.totalPages = 3;
    meta.hasPreviousPage = false;
    meta.hasNextPage = true;

    const response = new PaginatedResponseDto(data, meta);

    expect(response.data).toEqual(data);
    expect(response.meta).toBe(meta);
  });

  it('debería crear una instancia válida con el método estático create', () => {
    const data = ['item1', 'item2', 'item3'];
    const totalItems = 25;
    const currentPage = 1;
    const itemsPerPage = 10;

    const response = PaginatedResponseDto.create(data, totalItems, currentPage, itemsPerPage);

    expect(response.data).toEqual(data);
    expect(response.meta.currentPage).toBe(currentPage);
    expect(response.meta.itemsPerPage).toBe(itemsPerPage);
    expect(response.meta.totalItems).toBe(totalItems);
    expect(response.meta.totalPages).toBe(3); // 25/10 redondeado hacia arriba
    expect(response.meta.hasPreviousPage).toBe(false);
    expect(response.meta.hasNextPage).toBe(true);
  });

  it('debería calcular correctamente la paginación en la última página', () => {
    const data = ['item1', 'item2'];
    const totalItems = 12;
    const currentPage = 2;
    const itemsPerPage = 10;

    const response = PaginatedResponseDto.create(data, totalItems, currentPage, itemsPerPage);

    expect(response.meta.currentPage).toBe(2);
    expect(response.meta.totalPages).toBe(2);
    expect(response.meta.hasPreviousPage).toBe(true);
    expect(response.meta.hasNextPage).toBe(false);
  });

  it('debería calcular correctamente la paginación en una página intermedia', () => {
    const data = ['item1', 'item2', 'item3'];
    const totalItems = 30;
    const currentPage = 2;
    const itemsPerPage = 10;

    const response = PaginatedResponseDto.create(data, totalItems, currentPage, itemsPerPage);

    expect(response.meta.currentPage).toBe(2);
    expect(response.meta.totalPages).toBe(3);
    expect(response.meta.hasPreviousPage).toBe(true);
    expect(response.meta.hasNextPage).toBe(true);
  });
}); 