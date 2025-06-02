import { Injectable, Inject } from '@nestjs/common';
import { Invoice } from '../../domain/entities/invoice.entity';
import { 
  InvoiceRepositoryInterface, 
  INVOICE_REPOSITORY 
} from '../../domain/repositories/invoice.repository.interface';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    @Inject(INVOICE_REPOSITORY)
    private readonly invoiceRepository: InvoiceRepositoryInterface,
  ) {}

  async execute(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    try {
      // Validar datos de entrada
      this.validateInvoiceData(createInvoiceDto);

      // Crear la factura a través del repositorio
      const invoice = await this.invoiceRepository.create(createInvoiceDto);

      return invoice;
    } catch (error) {
      throw new Error(`Error al crear la factura: ${error.message}`);
    }
  }

  private validateInvoiceData(data: CreateInvoiceDto): void {
    if (!data.number || data.number.trim().length === 0) {
      throw new Error('El número de factura es requerido');
    }

    if (!data.customer || !data.customer.identification_number) {
      throw new Error('Los datos del cliente son requeridos');
    }

    if (!data.invoice_lines || data.invoice_lines.length === 0) {
      throw new Error('La factura debe tener al menos una línea de producto');
    }

    if (!data.legal_monetary_totals) {
      throw new Error('Los totales monetarios son requeridos');
    }

    // Validar que el total sea mayor a cero
    const payableAmount = parseFloat(data.legal_monetary_totals.payable_amount);
    if (isNaN(payableAmount) || payableAmount <= 0) {
      throw new Error('El monto a pagar debe ser mayor a cero');
    }
  }
} 