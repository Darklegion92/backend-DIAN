import { Invoice } from "@/invoice/domain/entities/invoice.entity";

export interface InvoiceListResponse {
  invoices: Invoice[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
} 