export interface ExternalCompanyUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  id_administrator: number | null;
  mail_host: string | null;
  mail_port: number | null;
  mail_username: string | null;
  mail_password: string | null;
  mail_encryption: string | null;
  mail_from_address: string | null;
  mail_from_name: string | null;
}

export interface ExternalCompanyData {
  id: number;
  user_id: number;
  identification_number: string;
  dv: string;
  language_id: number;
  tax_id: number;
  type_environment_id: number;
  payroll_type_environment_id: number;
  eqdocs_type_environment_id: number;
  type_operation_id: number;
  type_document_identification_id: number;
  country_id: number;
  type_currency_id: number;
  type_organization_id: number;
  type_regime_id: number;
  type_liability_id: number;
  municipality_id: number;
  merchant_registration: string;
  address: string;
  phone: string;
  password: string | null;
  newpassword: string | null;
  type_plan_id: number;
  type_plan2_id: number;
  type_plan3_id: number;
  type_plan4_id: number;
  start_plan_date: string | null;
  start_plan_date2: string | null;
  start_plan_date3: string | null;
  start_plan_date4: string | null;
  absolut_start_plan_date: string | null;
  state: number;
  imap_server: string;
  imap_user: string;
  imap_password: string;
  imap_port: string;
  imap_encryption: string;
  allow_seller_login: number;
  created_at: string;
  updated_at: string;
  user: ExternalCompanyUser;
  send: any[];
}

export interface ExternalCompanySuccessResponseDto {
  success: boolean;
  message: string;
  password: string;
  token: string;
  company: ExternalCompanyData;
}

export interface ExternalCompanyErrorResponseDto {
  message: string;
  errors: Record<string, string[]>;
}

export type ExternalCompanyResponseDto = ExternalCompanySuccessResponseDto | ExternalCompanyErrorResponseDto; 