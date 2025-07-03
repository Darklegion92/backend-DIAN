/**
 * DTO para la respuesta de pagos a terceros del servicio externo
 */
export class ThirdPartyPaymentDto {
  private readonly third_party_payment: string;

  constructor(thirdPartyPayment: string) {
    this.third_party_payment = thirdPartyPayment;
  }

  getThirdPartyPayment(): string {
    return this.third_party_payment;
  }
} 