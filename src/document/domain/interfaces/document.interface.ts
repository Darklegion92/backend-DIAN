// Interfaces para la lista de documentos
export interface DocumentData {
  id: number;
  prefix: string;
  number: string;
  type_document_id: number;
  state_document_id: number;
  created_at: string;
  updated_at: string;
  date: string;
  time: string;
  cufe?: string;
  customer_name?: string;
  customer_identification_number?: string;
  total_amount?: number;
  notes?: string;
}

export interface DocumentListPagination {
  current_page: number;
  data: DocumentData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface DocumentListResponse {
  success: boolean;
  message: string;
  data: DocumentListPagination;
}

export interface DocumentListRequest {
  created_at_from?: string;
  created_at_to?: string;
  prefix?: string;
  number?: string;
  identification_number?: string;
  type_document_id?: number;
  state_document_id: number;
  page?: number;
  per_page?: number;
}

// Interface para el envío de documento electrónico
export interface SendDocumentElectronicResponse {
  success: boolean;
  message: string;
  data: {
    cufe: string;
    date: string;
    document?: string;
  };
} 