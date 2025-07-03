import { Role } from '@/auth/domain/enums/role.enum';

export class InternalUserDataDto {
  id: string;
  email: string;
  role: Role;
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