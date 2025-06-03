import { UpdateEnvironmentDto } from '../../application/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '../../application/dtos/update-environment-response.dto';

export const EXTERNAL_API_SERVICE = 'EXTERNAL_API_SERVICE';

export interface IExternalApiService {
  updateEnvironment(updateData: UpdateEnvironmentDto): Promise<UpdateEnvironmentResponseDto>;
} 