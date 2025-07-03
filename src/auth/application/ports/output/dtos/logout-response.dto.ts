import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Indica si la operación fue exitosa',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Código de estado HTTP',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Timestamp de la respuesta',
    example: '2024-01-15T10:30:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Ruta del endpoint',
    example: '/auth/logout',
  })
  path: string;

  @ApiProperty({
    description: 'Método HTTP utilizado',
    example: 'POST',
  })
  method: string;

  @ApiProperty({
    description: 'Mensaje descriptivo de la respuesta',
    example: 'Sesión cerrada exitosamente',
  })
  message: string;
} 