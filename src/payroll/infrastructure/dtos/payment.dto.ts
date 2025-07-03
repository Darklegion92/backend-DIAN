/**
 * DTO para la respuesta de datos de pago del servicio externo
 */
export class PaymentDto {
  // NO APLICA
  private payment_method_id: string;
  // BANC_NOMBRE
  private bank_name: string;
  // NOEL_TIPOCTA
  private account_type: string;
  // NOEL_CUENTA
  private account_number: string;

  constructor(paymentMethodId: string) {
    this.payment_method_id = paymentMethodId;
  }

  getPaymentMethodId(): string {
    return this.payment_method_id;
  }

  getBankName(): string {
    return this.bank_name;
  }

  getAccountType(): string {
    return this.account_type;
  }

  getAccountNumber(): string {
    return this.account_number;
  }

  setBankName(bankName: string): void {
    this.bank_name = bankName;
  }

  setAccountType(accountType: string): void {
    this.account_type = accountType;
  }

  setAccountNumber(accountNumber: string): void {
    this.account_number = accountNumber;
  }

  setPaymentMethodId(paymentMethodId: string): void {
    this.payment_method_id = paymentMethodId;
  }
} 