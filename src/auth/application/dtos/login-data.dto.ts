import { UserRole } from '../../domain/entities/user.entity';

export class InternalUserDataDto {
  id: string;
  email: string;
  role: UserRole;
  company_document: string;
  first_name_person_responsible: string;
  last_name_person_responsible: string;
  job_title_person_responsible: string;
  organization_department_person_responsible: string;
  document_person_responsible: string;
}

export class InternalLoginDataDto {
  access_token: string;
  user: InternalUserDataDto;
} 