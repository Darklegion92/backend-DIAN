import { Injectable, Inject } from '@nestjs/common';
import { UpdateEnvironmentDto } from '@/company/presentation/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '@/company/presentation/dtos/update-environment-response.dto';
import { EXTERNAL_API_SERVICE } from '@/company/domain/services/company-environment.service.interface';
import { CompanyEnvironmentService } from '@/company/infrastructure/services/company-environment.service';

@Injectable()
export class UpdateEnvironmentUseCase {
  constructor(
    @Inject(EXTERNAL_API_SERVICE)
    private readonly externalApiService: CompanyEnvironmentService,
  ) {}

  async execute(
    updateEnvironmentDto: UpdateEnvironmentDto,
  ): Promise<UpdateEnvironmentResponseDto> { 

    // Llamar al servicio externo para actualizar el ambiente
    const result = await this.externalApiService.updateEnvironment(
      updateEnvironmentDto,
    );

    return result;
  }
} 