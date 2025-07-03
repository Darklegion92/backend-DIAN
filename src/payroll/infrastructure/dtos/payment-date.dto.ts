/**
 * DTO para la respuesta de fecha de pago del servicio externo
 * Campo relacionado con NOEL_FECRET
 */
export class PaymentDateDto {
  private readonly payment_date: string;

  constructor(paymentDate: string) {
    this.payment_date = paymentDate;
  }

  getPaymentDate(): string {
    return this.payment_date;
  }
} 