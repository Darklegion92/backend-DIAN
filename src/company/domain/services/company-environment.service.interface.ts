import { UpdateEnvironmentDto } from '@/company/presentation/dtos/update-environment.dto';
import { UpdateEnvironmentResponseDto } from '@/company/presentation/dtos/update-environment-response.dto';

export const EXTERNAL_API_SERVICE = 'EXTERNAL_API_SERVICE';

export interface ICompanyEnvironmentService {
  updateEnvironment(updateData: UpdateEnvironmentDto): Promise<UpdateEnvironmentResponseDto>;
} 