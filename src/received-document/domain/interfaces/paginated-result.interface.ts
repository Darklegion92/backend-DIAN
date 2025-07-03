import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResult<T> {
    @ApiProperty({
        description: 'Lista de elementos',
        isArray: true
    })
    items: T[];

    @ApiProperty({
        description: 'Número total de registros',
        type: Number,
        example: 100
    })
    total: number;

    @ApiProperty({
        description: 'Página actual',
        type: Number,
        example: 1
    })
    page: number;

    @ApiProperty({
        description: 'Cantidad de registros por página',
        type: Number,
        example: 10
    })
    limit: number;

    @ApiProperty({
        description: 'Número total de páginas',
        type: Number,
        example: 10
    })
    totalPages: number;
} 