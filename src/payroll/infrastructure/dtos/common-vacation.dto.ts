import { PaidVacationDto } from './paid-vacation.dto';

/**
 * DTO para la respuesta de vacaciones comunes del servicio externo
 * Extiende de PaidVacationDto agregando fechas de inicio y fin
 */
export class CommonVacationDto extends PaidVacationDto {
  private readonly start_date: string;
  private readonly end_date: string;

  constructor(startDate: string, endDate: string, quantity: number, payment: string) {
    super(quantity, payment);
    this.start_date = startDate;
    this.end_date = endDate;
  }

  getStartDate(): string {
    return this.start_date;
  }

  getEndDate(): string {
    return this.end_date;
  }
} 