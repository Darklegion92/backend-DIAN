import { Controller, Get, Query, UseGuards, Post, Body } from '@nestjs/common';
import { ReceivedDocumentService } from '../../domain/services/received-document.service';
import { ReceivedDocumentFilters } from '../../domain/interfaces/received-document-filters.interface';
import { PaginatedResult, ReceivedDocument } from '../../domain/repositories/received-document.repository';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard';
import { User } from 'src/auth/domain/entities/user.entity';
import { CurrentUser } from 'src/auth/infrastructure/decorators/current-user.decorator';

@ApiTags('Documentos Recibidos')
@Controller('received-documents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()          
export class ReceivedDocumentController {
    constructor(
        private readonly receivedDocumentService: ReceivedDocumentService,
    ) {}

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
        @Query('total') total?: number,
        @Query('customer') customer?: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number,
    ): Promise<PaginatedResult<ReceivedDocument>> {
        const filters: ReceivedDocumentFilters = {
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            prefix,
            number,
            total,
            customer,
            page: page ? page : 1,
            limit: limit ? limit : 10,
        };

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
                token: {
                    type: 'string',
                    description: 'Token de autenticación'
                }
            },
            required: ['start_date', 'end_date', 'token']
        }
    })
    async fetchInvoicesEmail(
        @Query('body') {start_date, end_date, token}: {start_date: string, end_date: string, token: string},
    ) {
        return this.receivedDocumentService.fetchInvoicesEmail(start_date, end_date, token);
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
                    description: 'Lista de CUFEs de los documentos'
                },
                token: {
                    type: 'string',
                    description: 'Token de autenticación'
                }
            },
            required: ['cufes', 'token']
        }
    })
    async sendEvent(
        @Body('cufes') {cufes, token}: {cufes: string[], token: string},
        @CurrentUser() user: User,
    ) {
        return this.receivedDocumentService.sendEvent(cufes, user, token);
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
                    description: 'CUFE del documento a rechazar'
                },
                token: {
                    type: 'string',
                    description: 'Token de autenticación'
                }
            },
            required: ['cufe', 'token']
        }
    })
    async rejectDocument(
        @Body('cufe') {cufe, token}: {cufe: string, token: string},
        @CurrentUser() user: User,
    ) {
        return this.receivedDocumentService.rejectDocument(cufe, user, token);
    }
} 