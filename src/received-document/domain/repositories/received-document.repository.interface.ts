
import { PaginatedResult } from '@/received-document/domain/interfaces/paginated-result.interface';
import { ReceivedDocument } from '../entities/received-document.entity';
import { ReceivedDocumentFilters } from '../interfaces/received-document-filters.interface';

export interface IReceivedDocumentRepository {
    findAll(filters: ReceivedDocumentFilters): Promise<PaginatedResult<ReceivedDocument>>;
    update(data: Partial<ReceivedDocument>, where: any): Promise<[number]>;
} 