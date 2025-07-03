import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la respuesta del documento
 */
export class DocumentResponseDto {
    @ApiProperty({
        description: 'CUFE (Código Único de Facturación Electrónica)',
        example: 'a1b2c3d4-e5f6-g7h8-i9j0'
    })
    cufe: string;

    @ApiProperty({
        description: 'Fecha del documento',
        example: '2024-01-31'
    })
    date: string;
}

/**
 * DTO genérico para la respuesta de creación de nómina
 */
export class CreatePayrollResponseDto {
    @ApiProperty({
        description: 'Indica si la operación fue exitosa',
        example: true
    })
    success: boolean;

    @ApiProperty({
        description: 'Código de estado HTTP',
        example: 201
    })
    statusCode: number;

    @ApiProperty({
        description: 'Mensaje descriptivo de la operación',
        example: 'Nómina creada exitosamente'
    })
    message: string;

    @ApiProperty({
        description: 'Datos del documento generado',
        type: DocumentResponseDto
    })
    data: DocumentResponseDto;
} 