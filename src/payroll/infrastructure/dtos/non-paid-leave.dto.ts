/**
 * DTO para la respuesta de licencias no remuneradas del servicio externo
 */
export class NonPaidLeaveDto {
  private readonly start_date: string;
  private readonly end_date: string;
  private readonly quantity: string;

  constructor(startDate: string, endDate: string, quantity: string) {
    this.start_date = startDate;
    this.end_date = endDate;
    this.quantity = quantity;
  }

  getStartDate(): string {
    return this.start_date;
  }

  getEndDate(): string {
    return this.end_date;
  }

  getQuantity(): string {
    return this.quantity;
  }
} 