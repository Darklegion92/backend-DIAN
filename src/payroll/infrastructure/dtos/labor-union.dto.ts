/**
 * DTO para la respuesta de deducciones sindicales del servicio externo
 */
export class LaborUnionDto {
  private readonly percentage: string;
  private readonly deduction: string;

  constructor(percentage: string, deduction: string) {
    this.percentage = percentage;
    this.deduction = deduction;
  }

  getPercentage(): string {
    return this.percentage;
  }

  getDeduction(): string {
    return this.deduction;
  }
} 