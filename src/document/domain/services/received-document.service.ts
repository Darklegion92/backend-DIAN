import { firstValueFrom } from 'rxjs';
import { ReceivedDocumentFilters, ImapReceiptAcknowledgmentResponse, ImapReceiptAcknowledgmentRequest, DataSendInvoiceEvent, ResponseEventDian, ResponseSendEvent } from '../interfaces/received-document-filters.interface';
import { IReceivedDocumentRepository, PaginatedResult, ReceivedDocument } from '../repositories/received-document.repository';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/auth/domain/entities/user.entity';
import { CompanyService } from 'src/config/application/services/company.service';

@Injectable()
export class ReceivedDocumentService {
    private readonly logger = new Logger(ReceivedDocumentService.name);
    private readonly externalApiUrl: string;

    constructor(
        @Inject('IReceivedDocumentRepository')
        private readonly receivedDocumentRepository: IReceivedDocumentRepository,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly companyService: CompanyService,
    ) {
        this.externalApiUrl = this.configService.get<string>('EXTERNAL_SERVER_URL');
        if (!this.externalApiUrl) {
            throw new Error('EXTERNAL_SERVER_URL no está configurada en las variables de entorno');
        }

    }

    async findAll(filters: ReceivedDocumentFilters): Promise<PaginatedResult<ReceivedDocument>> {
        return this.receivedDocumentRepository.findAll(filters);
    }


    /**
     * Fetch invoices email from the external API
     * @param start_date - Start date
     * @param end_date - End date
     * @param document_company - Document company
     * @returns ImapReceiptAcknowledgmentResponse
     */
    async fetchInvoicesEmail(start_date: string, end_date: string, document_company: string): Promise<ImapReceiptAcknowledgmentResponse> {
        const company = await this.companyService.getCompanyByNit(document_company);

        // Verificar si end_date es el día actual
        const today = new Date().toISOString().split('T')[0];
        if (end_date === today) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            end_date = tomorrow.toISOString().split('T')[0];
        }

        const request: ImapReceiptAcknowledgmentRequest = {
            start_date: start_date,
            end_date: end_date,
            only_read: true,
            base64_attacheddocument: false,
        }

        const response = await firstValueFrom(
            this.httpService.post<ImapReceiptAcknowledgmentResponse>(
                `${this.externalApiUrl}/imap_receipt_acknowledgment`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${company.tokenDian}`,
                    },
                    timeout: 20000000,
                },
            ),
        );


        return response.data;

    }

    /**
     * Send event data to the external API
     * @param dataSend - Data send
     * @param token - Token
     * @returns any
     */
    private async sendDianEvent(dataSend: DataSendInvoiceEvent, token: string): Promise<ResponseEventDian> {
        const response = await firstValueFrom(
            this.httpService.post<ResponseEventDian>(
                `${this.externalApiUrl}/send-event-data`,
                dataSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
        );

        return response.data;
    }

    /**
     * Send event to the external API
     * @param cufes - CUFEs
     * @param user - User
     * @param document_company - Document company
     * @returns ResponseSendEvent
     */
    async sendEvent(cufes: string[], user: User, document_company: string): Promise<ResponseSendEvent> {
        const company = await this.companyService.getCompanyByNit(document_company);
        for (const cufe of cufes) {
            const dataSend: DataSendInvoiceEvent = {
                event_id: "1",
                document_reference: {
                    cufe
                },
                issuer_party: {
                    identification_number: user.document_person_responsible,
                    first_name: user.first_name_person_responsible,
                    last_name: user.last_name_person_responsible,
                    organization_department: user.organization_department_person_responsible,
                    job_title: user.job_title_person_responsible
                }
            }

            const response = await this.sendDianEvent(dataSend, company.tokenDian);

            console.log("Response 1",response);
            
            if(response?.ResponseDian?.Envelope?.Body?.SendEventUpdateStatusResponse?.SendEventUpdateStatusResult?.ErrorMessage?.string?.includes("LGC62")){
                await this.receivedDocumentRepository.update({ state_document_id: 0 }, { where: { cufe } });
            }else if (response.message === 'Ya se registro este evento para este documento.' || response.success || response?.ResponseDian?.Envelope?.Body?.SendEventUpdateStatusResponse?.SendEventUpdateStatusResult?.IsValid === "true" 
                || response?.ResponseDian?.Envelope?.Body?.SendEventUpdateStatusResponse?.SendEventUpdateStatusResult?.ErrorMessage?.string?.includes("LGC01")) {
            
                        const dataSend: DataSendInvoiceEvent = {
                            event_id: "3",
                            document_reference: {
                                cufe
                            },
                            issuer_party: {
                                identification_number: user.document_person_responsible,
                                first_name: user.first_name_person_responsible,
                                last_name: user.last_name_person_responsible,
                                organization_department: user.organization_department_person_responsible,
                                job_title: user.job_title_person_responsible
                            }
                        }

                        const response = await this.sendDianEvent(dataSend, company.tokenDian);
                        if (response?.ResponseDian?.Envelope?.Body?.SendEventUpdateStatusResponse?.SendEventUpdateStatusResult?.IsValid === "true"  
                            || response.success || response?.ResponseDian?.Envelope?.Body?.SendEventUpdateStatusResponse?.SendEventUpdateStatusResult?.ErrorMessage?.string?.includes("LGC01")) {

                                const dataSend: DataSendInvoiceEvent = {
                                    event_id: "4",
                                    document_reference: {
                                        cufe
                                    },
                                    issuer_party: {
                                        identification_number: user.document_person_responsible,
                                        first_name: user.first_name_person_responsible,
                                        last_name: user.last_name_person_responsible,
                                        organization_department: user.organization_department_person_responsible,
                                        job_title: user.job_title_person_responsible
                                    }
                                }

                                await this.sendDianEvent(dataSend, company.tokenDian);
                            }
                }
        }

        return {
            success: true,
            message: 'Evento de aceptación enviado correctamente'
        }

    }

    /**
     * Reject document
     * @param cufe - CUFE
     * @param user - User
     * @param document_company - Document company
     * @returns ResponseSendEvent
     */
    async rejectDocument(cufe: string, user: User, document_company: string): Promise<ResponseSendEvent> {
        const company = await this.companyService.getCompanyByNit(document_company);
        const dataSend: DataSendInvoiceEvent = {
            event_id: "2",
            document_reference: {
                cufe
            },
            issuer_party: {
                identification_number: user.document_person_responsible,
                first_name: user.first_name_person_responsible,
                last_name: user.last_name_person_responsible,
                organization_department: user.organization_department_person_responsible,
                job_title: user.job_title_person_responsible
            }
        }

        await this.sendDianEvent(dataSend, company.tokenDian);

        return {
            success: true,
            message: 'Evento de rechazo enviado correctamente'
        }
    }
} 