import { User } from '@/auth/domain/entities/user.entity';
import { CurrentUser } from '@/auth/presentation/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/presentation/guards/jwt-auth.guard';
import { ReceivedDocument } from '@/received-document/domain/entities/received-document.entity';
import { PaginatedResult } from '@/received-document/domain/interfaces/paginated-result.interface';
import { ReceivedDocumentService } from '@/received-document/application/services/received-document.service';
import { Controller, Get, Query, UseGuards, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { ReceivedDocumentFilters } from '@/received-document/domain/interfaces/received-document-filters.interface';

@ApiTags('Documentos Recibidos')
@Controller('received-documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReceivedDocumentController {
    constructor(
        private readonly receivedDocumentService: ReceivedDocumentService,
    ) { }

    @Get()
    @ApiOperation({
        summary: 'Obtener documentos recibidos',
        description: 'Recupera una lista paginada de documentos recibidos con filtros opcionales'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de documentos recuperada exitosamente',
        schema: {
            type: 'object',
            properties: {
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', description: 'Identificador único del documento' },
                            prefix: { type: 'string', description: 'Prefijo del documento' },
                            number: { type: 'string', description: 'Número del documento' },
                            date: { type: 'string', format: 'date-time', description: 'Fecha del documento' },
                            total: { type: 'number', description: 'Valor total del documento' },
                            customer: { type: 'string', description: 'Nombre o identificación del cliente' }
                        }
                    }
                },
                total: { type: 'number', description: 'Número total de registros' },
                page: { type: 'number', description: 'Página actual' },
                limit: { type: 'number', description: 'Cantidad de registros por página' },
                totalPages: { type: 'number', description: 'Número total de páginas' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Solicitud incorrecta - Parámetros de filtro inválidos'
    })
    @ApiResponse({
        status: 500,
        description: 'Error interno del servidor'
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Fecha de inicio (YYYY-MM-DD)',
        example: '2024-01-01'
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Fecha fin (YYYY-MM-DD)',
        example: '2024-12-31'
    })
    @ApiQuery({
        name: 'prefix',
        required: false,
        type: String,
        description: 'Prefijo del documento',
        example: 'FEVA'
    })
    @ApiQuery({
        name: 'number',
        required: true,
        type: String,
        description: 'Número del documento',
        example: '1001'
    })
    @ApiQuery({
        name: 'total',
        required: false,
        type: Number,
        description: 'Total del documento',
        example: 1000000
    })
    @ApiQuery({
        name: 'customer',
        required: false,
        type: String,
        description: 'Nombre o identificación del cliente',
        example: '900123456-1'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Número de página (comienza en 1)',
        example: 1
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Límite de registros por página',
        example: 10
    })
    async findAll(
        @Query('number') number: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('prefix') prefix?: string,
        @Query('customer') customer?: string,
        @Query('aceptacion') aceptacion?: number,
        @Query('page') page?: number,
        @Query('identification_number') identification_number?: number,
        @Query('limit') limit?: number,
    ): Promise<PaginatedResult<ReceivedDocument>> {
        const filters: ReceivedDocumentFilters = {
            startDate: startDate ? startDate : undefined,
            endDate: endDate ? new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)).toISOString().split('T')[0] : undefined,
            prefix,
            number,
            customer,
            identification_number,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10
        };

        if (aceptacion === 0) {
            filters.aceptacion = false;
        } else if (aceptacion === 1) {
            filters.aceptacion = true;
        }

        return this.receivedDocumentService.findAll(filters);
    }

    @Post('fetch-invoices-email')
    @ApiOperation({
        summary: 'Obtener documentos desde el correo electrónico',
        description: 'Recupera documentos de facturación desde el correo electrónico en un rango de fechas'
    })
    @ApiResponse({
        status: 200,
        description: 'Documentos recuperados exitosamente'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                start_date: {
                    type: 'string',
                    description: 'Fecha de inicio (YYYY-MM-DD)',
                    example: '2024-01-01'
                },
                end_date: {
                    type: 'string',
                    description: 'Fecha fin (YYYY-MM-DD)',
                    example: '2024-12-31'
                },
            },
            required: ['start_date', 'end_date']        
        }
    })
    async fetchInvoicesEmail(
        @Body() { start_date, end_date }: { start_date: string, end_date: string },
        @CurrentUser() user: User,
    ) {
        return this.receivedDocumentService.fetchInvoicesEmail(start_date, end_date, user.company_document);
    }

    @Post('send-event')
    @ApiOperation({
        summary: 'Enviar evento de aceptación a la DIAN',
        description: 'Envía un evento de aceptación para uno o más documentos a la DIAN'
    })
    @ApiResponse({
        status: 200,
        description: 'Evento enviado exitosamente'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                cufes: {
                    type: 'array',
                    items: {
                        type: 'string'
                    },
                    description: 'Lista de CUFEs de los documentos',
                    example: ['1234567890', '1234567891']
                },
            },
            required: ['cufes']
        }
    })
    async sendEvent(
        @Body() cufes: string[],
        @CurrentUser() user: User,
    ) {
        return this.receivedDocumentService.sendEvent(cufes, user, user.company_document);
    }

    @Post('reject-document')
    @ApiOperation({
        summary: 'Rechazar documento',
        description: 'Envía un evento de rechazo para un documento a la DIAN'
    })
    @ApiResponse({
        status: 200,
        description: 'Documento rechazado exitosamente'
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                cufe: {
                    type: 'string',
                    description: 'CUFE del documento a rechazar',
                    example: '1234567890'
                },
            },
            required: ['cufe']
        }
    })
    async rejectDocument(
        @Body() cufe: string,
        @CurrentUser() user: User,
    ) {
        return this.receivedDocumentService.rejectDocument(cufe, user, user.company_document);
    }
} 