/**
 * DTO para la respuesta de incapacidades laborales del servicio externo
 */
export class WorkDisabilitiesDto {
  private readonly type: number;
  private readonly start_date: string;
  private readonly end_date: string;
  private readonly quantity: number;
  private readonly payment: string;

  constructor(
    startDate: string,
    endDate: string,
    quantity: number,
    payment: string,
    type: number
  ) {
    this.type = type;
    this.start_date = startDate;
    this.end_date = endDate;
    this.quantity = quantity;
    this.payment = payment;
  }

  getType(): number {
    return this.type;
  }

  getStartDate(): string {
    return this.start_date;
  }

  getEndDate(): string {
    return this.end_date;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPayment(): string {
    return this.payment;
  }
} 