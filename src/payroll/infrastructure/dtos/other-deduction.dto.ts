/**
 * DTO para la respuesta de otras deducciones del servicio externo
 */
export class OtherDeductionDto {
  private readonly other_deduction: string;

  constructor(otherDeduction: string) {
    this.other_deduction = otherDeduction;
  }

  getOtherDeduction(): string {
    return this.other_deduction;
  }
} 