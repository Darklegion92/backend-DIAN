import { Injectable, Inject } from '@nestjs/common';
import { UpdateEnvironmentDto } from '../dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '../dtos/update-environment-response.dto';
import { IExternalApiService, EXTERNAL_API_SERVICE } from '../../domain/services/external-api.service.interface';

@Injectable()
export class UpdateEnvironmentUseCase {
  constructor(
    @Inject(EXTERNAL_API_SERVICE)
    private readonly externalApiService: IExternalApiService,
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