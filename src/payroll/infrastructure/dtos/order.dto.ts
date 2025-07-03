/**
 * DTO para la respuesta de órdenes del servicio externo
 */
export class OrderDto {
  private readonly description: string;
  private readonly deduction: string;

  constructor(description: string, deduction: string) {
    this.description = description;
    this.deduction = deduction;
  }

  getDescription(): string {
    return this.description;
  }

  getDeduction(): string {
    return this.deduction;
  }
} 