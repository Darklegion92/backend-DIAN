/**
 * DTO para la respuesta de auxilios del servicio externo
 */
export class AidDto {
  private readonly salary_assistance: string;
  private readonly non_salary_assistance: string;

  constructor(salaryAssistance: string, nonSalaryAssistance: string) {
    this.salary_assistance = salaryAssistance;
    this.non_salary_assistance = nonSalaryAssistance;
  }

  getSalaryAssistance(): string {
    return this.salary_assistance;
  }

  getNonSalaryAssistance(): string {
    return this.non_salary_assistance;
  }
} 