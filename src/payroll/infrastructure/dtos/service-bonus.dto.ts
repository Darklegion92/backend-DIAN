import { PaidVacationDto } from './paid-vacation.dto';

/**
 * DTO para la respuesta de primas de servicio del servicio externo
 * Extiende de PaidVacationDto agregando el pago no salarial
 */
export class ServiceBonusDto extends PaidVacationDto {
  private readonly paymentNS: string;

  constructor(quantity: number, payment: string, paymentNS: string) {
    super(quantity, payment);
    this.paymentNS = paymentNS;
  }

  getPaymentNS(): string {
    return this.paymentNS;
  }
} 