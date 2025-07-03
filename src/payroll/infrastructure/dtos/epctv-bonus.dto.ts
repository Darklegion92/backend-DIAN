/**
 * DTO para la respuesta de bonos EPCTV del servicio externo
 */
export class EpctvBonusDto {
  private readonly paymentS: string;
  private readonly paymentNS: string;
  private salary_food_payment: string;
  private non_salary_food_payment: string;

  constructor(paymentS: string, paymentNS: string) {
    this.paymentS = paymentS;
    this.paymentNS = paymentNS;
  }

  getPaymentS(): string {
    return this.paymentS;
  }

  getPaymentNS(): string {
    return this.paymentNS;
  }

  getSalaryFoodPayment(): string {
    return this.salary_food_payment;
  }

  getNonSalaryFoodPayment(): string {
    return this.non_salary_food_payment;
  }

  setSalaryFoodPayment(salaryFoodPayment: string): void {
    this.salary_food_payment = salaryFoodPayment;
  }

  setNonSalaryFoodPayment(nonSalaryFoodPayment: string): void {
    this.non_salary_food_payment = nonSalaryFoodPayment;
  }
} 