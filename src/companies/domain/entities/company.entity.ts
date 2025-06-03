export interface CompanyUser {
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

export interface CompanySend {
  id: number;
  year: number;
  next_consecutive: number;
  created_at: string;
  updated_at: string;
}

export interface Company {
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
  imap_server: string | null;
  imap_user: string | null;
  imap_password: string | null;
  imap_port: number | null;
  imap_encryption: string | null;
  allow_seller_login: number;
  created_at: string;
  updated_at: string;
  soltec_user_id: string;
  user?: CompanyUser;
  send?: CompanySend[];
} 