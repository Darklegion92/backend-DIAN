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
        description: 'Indica el Estado de la operación retornado por el servicio',
        example: 200
    })
    codigo: number;

    @ApiProperty({
        description: 'Este mensaje está asociado al código de respuesta, útil para identificación de errores',
        example: 'Nómina procesada exitosamente'
    })
    mensaje: string;

    @ApiProperty({
        description: 'Resultado del consumo del método: "Procesado" ó "Error"',
        example: 'Procesado'
    })
    resultado: string;

    @ApiProperty({
        description: 'Prefijo y Consecutivo del Documento concatenado sin separadores',
        example: 'PRUE980338337'
    })
    consecutivoDocumento: string;

    @ApiProperty({
        description: 'Código Único de Nómina Electrónica correspondiente al documento consultado',
        example: 'a1b2c3d4-e5f6-g7h8-i9j0'
    })
    cune: string;

    @ApiProperty({
        description: 'Número de seguimiento, es un UUID, para consultar posteriormente el proceso asíncrono',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    trackId: string;

    @ApiProperty({
        description: 'Reglas de validación en caso de notificación TFHKA',
        type: [String],
        example: ['Regla 1', 'Regla 2']
    })
    reglasNotificacionesTFHKA: string[];

    @ApiProperty({
        description: 'Reglas de validación en caso de notificación DIAN',
        type: [String],
        example: ['Regla 1', 'Regla 2']
    })
    reglasNotificacionesDIAN: string[];

    @ApiProperty({
        description: 'Reglas de validación en caso de rechazo TFHKA',
        type: [String],
        example: ['Regla 1', 'Regla 2']
    })
    reglasRechazoTFHKA: string[];

    @ApiProperty({
        description: 'Reglas de validación en caso de rechazo DIAN',
        type: [String],
        example: ['Regla 1', 'Regla 2']
    })
    reglasRechazoDIAN: string[];
} 