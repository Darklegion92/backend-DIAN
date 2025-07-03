/**
 * DTO para la respuesta de vacaciones pagadas del servicio externo
 */
export class PaidVacationDto {
  private readonly quantity: number;
  private readonly payment: string;

  constructor(quantity: number, payment: string) {
    this.quantity = quantity;
    this.payment = payment;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getPayment(): string {
    return this.payment;
  }
} 