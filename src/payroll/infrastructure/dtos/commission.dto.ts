/**
 * DTO para la respuesta de comisiones del servicio externo
 */
export class CommissionDto {
  private readonly commission: string;

  constructor(commission: string) {
    this.commission = commission;
  }

  getCommission(): string {
    return this.commission;
  }
} 