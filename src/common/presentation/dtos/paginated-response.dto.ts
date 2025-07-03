import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Página actual',
    example: 1,
  })
  currentPage: number;

  @ApiProperty({
    description: 'Elementos por página',
    example: 10,
  })
  itemsPerPage: number;

  @ApiProperty({
    description: 'Total de elementos',
    example: 25,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 3,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Si hay página anterior',
    example: false,
  })
  hasPreviousPage: boolean;

  @ApiProperty({
    description: 'Si hay página siguiente',
    example: true,
  })
  hasNextPage: boolean;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Datos de la página actual',
    type: 'array',
  })
  data: T[];

  @ApiProperty({
    description: 'Metadatos de paginación',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }

  static create<T>(
    data: T[],
    totalItems: number,
    currentPage: number,
    itemsPerPage: number,
  ): PaginatedResponseDto<T> {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const meta: PaginationMetaDto = {
      currentPage,
      itemsPerPage,
      totalItems,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
    };

    return new PaginatedResponseDto(data, meta);
  }
} 