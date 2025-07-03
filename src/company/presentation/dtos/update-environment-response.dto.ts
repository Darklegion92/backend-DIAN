import { ApiProperty } from '@nestjs/swagger';
import { Company } from '@/company/domain/entities/company.entity';

export class UpdateEnvironmentResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Ambiente actualizado con éxito',
  })
  message: string;

  @ApiProperty({
    description: 'Datos de la empresa actualizada',
    type: Object,
  })
  company: Company;
} 