/**
 * DTO para la respuesta de horas del servicio externo
 * Utilizado para horas extras, recargos y otros conceptos relacionados con tiempo
 */
export class HDto {
  private readonly percentage: number;
  private readonly quantity: number;
  private readonly start_time: string;
  private readonly end_time: string;
  private readonly payment: string;

  constructor(
    startTime: string,
    endTime: string,
    quantity: number,
    percentage: number,
    payment: string
  ) {
    this.start_time = startTime;
    this.end_time = endTime;
    this.quantity = quantity;
    this.percentage = percentage;
    this.payment = payment;
  }

  getPercentage(): number {
    return this.percentage;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getStartTime(): string {
    return this.start_time;
  }

  getEndTime(): string {
    return this.end_time;
  }

  getPayment(): string {
    return this.payment;
  }
} 