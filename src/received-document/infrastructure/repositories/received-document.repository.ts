import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReceivedDocumentFilters } from '../../domain/interfaces/received-document-filters.interface';
import { IReceivedDocumentRepository } from '@/received-document/domain/repositories/received-document.repository.interface';
import { ReceivedDocument } from '@/received-document/domain/entities/received-document.entity';
import { PaginatedResult } from '@/received-document/domain/interfaces/paginated-result.interface';

@Injectable()
export class ReceivedDocumentRepository implements IReceivedDocumentRepository {
    constructor(
        @InjectRepository(ReceivedDocument)
        private readonly receivedDocumentRepository: Repository<ReceivedDocument>,
    ) {}
    async update(data: Partial<ReceivedDocument>, where: any): Promise<[number]> {

        const result = await this.receivedDocumentRepository.update(where.where,data);
        
        return [result.affected || 0];
    }

    async findAll(filters: ReceivedDocumentFilters): Promise<PaginatedResult<ReceivedDocument>> {
        const { 
            startDate, 
            endDate, 
            prefix, 
            number, 
            customer,
            customer_name,
            identification_number,
            cufe,
            type_document_id,
            acu_recibo,
            rec_bienes,
            aceptacion,
            rechazo,
            page = 1, 
            limit = 10 
        } = filters;
        
        const queryBuilder = this.receivedDocumentRepository.createQueryBuilder('rd');

       queryBuilder.andWhere('rd.acu_recibo = 1');

        if (startDate && endDate) {
            queryBuilder.andWhere('rd.date_issue BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }

        if (prefix) {
            queryBuilder.andWhere('rd.prefix LIKE :prefix', { prefix: `%${prefix}%` });
        }

        if (number) {
            queryBuilder.andWhere('rd.number LIKE :number', { number: `%${number}%` });
        }

        if (customer) {
            queryBuilder.andWhere('rd.customer LIKE :customer', { customer: `%${customer}%` });
        }

        if (customer_name) {
            queryBuilder.andWhere('rd.customer_name LIKE :customer_name', { customer_name: `%${customer_name}%` });
        }

        if (identification_number) {
            queryBuilder.andWhere('rd.identification_number = :identification_number', { identification_number });
        }

        if (cufe) {
            queryBuilder.andWhere('rd.cufe = :cufe', { cufe });
        }

        if (type_document_id) {
            queryBuilder.andWhere('rd.type_document_id = :type_document_id', { type_document_id });
        }

        if (acu_recibo !== undefined) {
            queryBuilder.andWhere('rd.acu_recibo = :acu_recibo', { acu_recibo });
        }

        if (rec_bienes !== undefined) {
            queryBuilder.andWhere('rd.rec_bienes = :rec_bienes', { rec_bienes });
        }

        if (aceptacion !== undefined) {
            queryBuilder.andWhere('rd.aceptacion = :aceptacion', { aceptacion });
        }

        if (rechazo !== undefined) {
            queryBuilder.andWhere('rd.rechazo = :rechazo', { rechazo });
        }

        const skip = (page - 1) * limit;
        
        const [items, totalItems] = await queryBuilder
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        console.log(totalItems);

        const documents = items.map(item => ({
            ...item,
            id: Number(item.id)
        }));

        return {
            items: documents,
            total: totalItems,
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit),
        };
    }
} 