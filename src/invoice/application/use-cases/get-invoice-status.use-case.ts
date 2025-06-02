import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '../../domain/entities/invoice.entity';
import { 
  InvoiceRepositoryInterface, 
  INVOICE_REPOSITORY 
} from '../../domain/repositories/invoice.repository.interface';

@Injectable()
export class GetInvoiceStatusUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepositoryInterface,
  ) {}

  async execute(invoiceNumber: string): Promise<{ status: InvoiceStatus; invoiceNumber: string }> {
    try {
      // Validar entrada
      this.validateInvoiceNumber(invoiceNumber);

      // Obtener el estado de la factura
      const status = await this.invoiceRepository.getStatus(invoiceNumber);

      return {
        status,
        invoiceNumber,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Error al consultar el estado de la factura: ${error.message}`);
    }
  }

  private validateInvoiceNumber(invoiceNumber: string): void {
    if (!invoiceNumber || invoiceNumber.trim().length === 0) {
      throw new Error('El número de factura es requerido');
    }

    // Validar formato básico del número de factura
    if (invoiceNumber.length < 3) {
      throw new Error('El número de factura debe tener al menos 3 caracteres');
    }
  }
} 