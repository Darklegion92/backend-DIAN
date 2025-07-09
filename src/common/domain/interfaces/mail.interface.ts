export interface SendMailRequest {
  prefix: string;
  number: string;
  token: string;
  email_cc_list?: { email: string }[];
  html_body?: string;
  base64graphicrepresentation?: string;
}

export interface SendMailResponse {
  message: string;
  success: boolean;
} 