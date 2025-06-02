import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dtos/pagination-query.dto';

export class CompanyFilterQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filtrar por documento o nombre de la empresa',
    example: '900123456',
  })
  @IsOptional()
  @IsString()
  dato?: string;
} 