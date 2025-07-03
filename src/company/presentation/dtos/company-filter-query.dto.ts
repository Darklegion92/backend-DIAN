import { PaginationQueryDto } from '@/common/presentation/dtos/pagination-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CompanyFilterQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por documento o nombre de la empresa',
    example: '900123456',
  })
  @IsOptional()
  @IsString()
  dato?: string;
} 