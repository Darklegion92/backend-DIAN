/**
 * DTO para la respuesta de bonos del servicio externo
 */
export class BonusDto {
  private readonly salary_bonus: string;
  private readonly non_salary_bonus: string;

  constructor(salaryBonus: string, nonSalaryBonus: string) {
    this.salary_bonus = salaryBonus;
    this.non_salary_bonus = nonSalaryBonus;
  }

  getSalaryBonus(): string {
    return this.salary_bonus;
  }

  getNonSalaryBonus(): string {
    return this.non_salary_bonus;
  }
} 