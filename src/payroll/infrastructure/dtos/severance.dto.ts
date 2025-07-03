/**
 * DTO para la respuesta de cesantías del servicio externo
 */
export class SeveranceDto {
  private readonly payment: string;
  private readonly percentage: string;
  private readonly interest_payment: string;

  constructor(payment: string, percentage: string, interestPayment: string) {
    this.payment = payment;
    this.percentage = percentage;
    this.interest_payment = interestPayment;
  }

  getPayment(): string {
    return this.payment;
  }

  getPercentage(): string {
    return this.percentage;
  }

  getInterestPayment(): string {
    return this.interest_payment;
  }
} 