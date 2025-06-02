import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { Invoice, InvoiceStatus } from '../../domain/entities/invoice.entity';
import { InvoiceRepositoryInterface } from '../../domain/repositories/invoice.repository.interface';

@Injectable()
export class InvoiceRepository implements InvoiceRepositoryInterface {
  private readonly externalServiceUrl: string;
  private readonly authToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.externalServiceUrl = this.configService.get<string>('EXTERNAL_INVOICE_SERVICE_URL') || 'http://localhost:8080/api';
    this.authToken = this.configService.get<string>('EXTERNAL_SERVICE_TOKEN');
  }

  async create(invoiceData: any): Promise<Invoice> {
    try {
      const headers = this.buildHeaders();
      
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.post(
          `${this.externalServiceUrl}/factura`,
          invoiceData,
          { headers }
        )
      );

      // Mapear la respuesta a la entidad de dominio
      return this.mapToInvoiceEntity(invoiceData, response.data);
    } catch (error) {
      this.handleHttpError(error, 'Error al crear la factura');
    }
  }

  async getStatus(invoiceNumber: string): Promise<InvoiceStatus> {
    try {
      const headers = this.buildHeaders();

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${this.externalServiceUrl}/factura/${invoiceNumber}/status`,
          { headers }
        )
      );

      // Mapear el estado de la respuesta externa al enum interno
      return this.mapToInvoiceStatus(response.data.status);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Factura con número ${invoiceNumber} no encontrada`);
      }
      this.handleHttpError(error, 'Error al consultar el estado de la factura');
    }
  }

  async findByNumber(invoiceNumber: string): Promise<Invoice | null> {
    try {
      const headers = this.buildHeaders();

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${this.externalServiceUrl}/factura/${invoiceNumber}`,
          { headers }
        )
      );

      return this.mapToInvoiceEntity(response.data, response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      this.handleHttpError(error, 'Error al buscar la factura');
    }
  }

  async updateStatus(invoiceNumber: string, status: InvoiceStatus): Promise<Invoice> {
    try {
      const headers = this.buildHeaders();

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.patch(
          `${this.externalServiceUrl}/factura/${invoiceNumber}/status`,
          { status: this.mapFromInvoiceStatus(status) },
          { headers }
        )
      );

      return this.mapToInvoiceEntity(response.data, response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Factura con número ${invoiceNumber} no encontrada`);
      }
      this.handleHttpError(error, 'Error al actualizar el estado de la factura');
    }
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private mapToInvoiceEntity(originalData: any, responseData: any): Invoice {
    return new Invoice(
      originalData.number || responseData.number,
      originalData.type_document_id || responseData.type_document_id,
      originalData.date || responseData.date,
      originalData.time || responseData.time,
      originalData.resolution_number || responseData.resolution_number,
      originalData.prefix || responseData.prefix,
      this.mapToInvoiceStatus(responseData.status || 'DRAFT'),
      originalData.notes || responseData.notes,
    );
  }

  private mapToInvoiceStatus(externalStatus: string): InvoiceStatus {
    const statusMap: Record<string, InvoiceStatus> = {
      'DRAFT': InvoiceStatus.DRAFT,
      'SENT': InvoiceStatus.SENT,
      'ACCEPTED': InvoiceStatus.ACCEPTED,
      'REJECTED': InvoiceStatus.REJECTED,
      'CANCELLED': InvoiceStatus.CANCELLED,
      'BORRADOR': InvoiceStatus.DRAFT,
      'ENVIADO': InvoiceStatus.SENT,
      'ACEPTADO': InvoiceStatus.ACCEPTED,
      'RECHAZADO': InvoiceStatus.REJECTED,
      'CANCELADO': InvoiceStatus.CANCELLED,
    };

    return statusMap[externalStatus?.toUpperCase()] || InvoiceStatus.DRAFT;
  }

  private mapFromInvoiceStatus(status: InvoiceStatus): string {
    const statusMap: Record<InvoiceStatus, string> = {
      [InvoiceStatus.DRAFT]: 'DRAFT',
      [InvoiceStatus.SENT]: 'SENT',
      [InvoiceStatus.ACCEPTED]: 'ACCEPTED',
      [InvoiceStatus.REJECTED]: 'REJECTED',
      [InvoiceStatus.CANCELLED]: 'CANCELLED',
    };

    return statusMap[status];
  }

  private handleHttpError(error: any, message: string): never {
    if (error.response) {
      throw new HttpException(
        {
          success: false,
          message,
          error: error.response.data,
          statusCode: error.response.status,
        },
        error.response.status,
      );
    } else if (error.request) {
      throw new HttpException(
        {
          success: false,
          message: 'No se pudo conectar con el servicio externo',
          error: 'Timeout o conexión rechazada',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    } else {
      throw new HttpException(
        {
          success: false,
          message: 'Error interno del servidor',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 