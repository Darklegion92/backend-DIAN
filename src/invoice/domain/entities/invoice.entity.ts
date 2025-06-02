import { ApiProperty } from '@nestjs/swagger';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export class Invoice {
  @ApiProperty({
    description: 'Número único de la factura',
    example: 'FACT-001',
  })
  readonly number: string;

  @ApiProperty({
    description: 'ID del tipo de documento',
    example: '01',
  })
  readonly typeDocumentId: string;

  @ApiProperty({
    description: 'Fecha de emisión de la factura',
    example: '2024-01-15',
  })
  readonly date: string;

  @ApiProperty({
    description: 'Hora de emisión de la factura',
    example: '10:30:00',
  })
  readonly time: string;

  @ApiProperty({
    description: 'Estado actual de la factura',
    enum: InvoiceStatus,
    example: InvoiceStatus.DRAFT,
  })
  readonly status: InvoiceStatus;

  @ApiProperty({
    description: 'Notas adicionales de la factura',
    example: 'Factura por servicios de consultoría',
    required: false,
  })
  readonly notes?: string;

  @ApiProperty({
    description: 'Número de resolución DIAN',
    example: '18760000001',
  })
  readonly resolutionNumber: string;

  @ApiProperty({
    description: 'Prefijo de la factura',
    example: 'FACT',
  })
  readonly prefix: string;

  constructor(
    number: string,
    typeDocumentId: string,
    date: string,
    time: string,
    resolutionNumber: string,
    prefix: string,
    status: InvoiceStatus = InvoiceStatus.DRAFT,
    notes?: string,
  ) {
    this.number = number;
    this.typeDocumentId = typeDocumentId;
    this.date = date;
    this.time = time;
    this.status = status;
    this.resolutionNumber = resolutionNumber;
    this.prefix = prefix;
    this.notes = notes;

    this.validate();
  }

  private validate(): void {
    if (!this.number || this.number.trim().length === 0) {
      throw new Error('El número de factura es requerido');
    }

    if (!this.typeDocumentId || this.typeDocumentId.trim().length === 0) {
      throw new Error('El tipo de documento es requerido');
    }

    if (!this.date || this.date.trim().length === 0) {
      throw new Error('La fecha es requerida');
    }

    if (!this.time || this.time.trim().length === 0) {
      throw new Error('La hora es requerida');
    }

    if (!this.resolutionNumber || this.resolutionNumber.trim().length === 0) {
      throw new Error('El número de resolución es requerido');
    }

    if (!this.prefix || this.prefix.trim().length === 0) {
      throw new Error('El prefijo es requerido');
    }
  }

  public changeStatus(newStatus: InvoiceStatus): Invoice {
    return new Invoice(
      this.number,
      this.typeDocumentId,
      this.date,
      this.time,
      this.resolutionNumber,
      this.prefix,
      newStatus,
      this.notes,
    );
  }

  public isEditable(): boolean {
    return this.status === InvoiceStatus.DRAFT;
  }

  public isCancellable(): boolean {
    return [InvoiceStatus.DRAFT, InvoiceStatus.SENT].includes(this.status);
  }
} 