import { LaborUnionDto } from './labor-union.dto';
import { SanctionDto } from './sanction.dto';
import { OrderDto } from './order.dto';
import { ThirdPartyPaymentDto } from './third-party-payment.dto';
import { AdvanceDto } from './advance.dto';
import { OtherDeductionDto } from './other-deduction.dto';

/**
 * DTO para manejar las deducciones en la nómina electrónica
 * Contiene todos los conceptos que se descuentan del total devengado
 */
export class DeductionsDto {
  private readonly eps_type_law_deductions_id: string;
  private readonly eps_deduction: string;
  private readonly pension_type_law_deductions_id: string;
  private readonly pension_deduction: string;
  private deductions_total: string;
  private eps_base_value?: string;
  private pension_base_value?: string;
  private fondossp_type_law_deductions_id?: string;
  private fondosp_deduction_SP?: string;
  private fondossp_sub_type_law_deductions_id?: string;
  private fondosp_deduction_sub?: string;
  private labor_union?: LaborUnionDto[];
  private sanctions?: SanctionDto[];
  private orders?: OrderDto[];
  private voluntary_pension?: string;
  private withholding_at_source?: string;
  private afc?: string;
  private cooperative?: string;
  private tax_liens?: string;
  private supplementary_plan?: string;
  private education?: string;
  private refund?: string;
  private debt?: string;
  private third_party_payments?: ThirdPartyPaymentDto[];
  private advances?: AdvanceDto[];
  private other_deductions?: OtherDeductionDto[];

  constructor(
    epsTypeLawDeductionsId: string,
    epsDeduction: string,
    pensionTypeLawDeductionsId: string,
    pensionDeduction: string
  ) {
    this.eps_type_law_deductions_id = epsTypeLawDeductionsId;
    this.eps_deduction = epsDeduction;
    this.pension_type_law_deductions_id = pensionTypeLawDeductionsId;
    this.pension_deduction = pensionDeduction;
    this.deductions_total = this.formatNumber(
      this.parseDouble(epsDeduction) + this.parseDouble(pensionDeduction)
    );
  }

  /**
   * Formatea un número a string con 2 decimales
   */
  private formatNumber(value: number): string {
    return value.toFixed(2);
  }

  /**
   * Convierte un string a número, retorna 0 si hay error
   */
  private parseDouble(value: string): number {
    try {
      return parseFloat(value);
    } catch {
      return 0;
    }
  }

  // Getters
  getEpsTypeLawDeductionsId(): string {
    return this.eps_type_law_deductions_id;
  }

  getEpsDeduction(): string {
    return this.eps_deduction;
  }

  getPensionTypeLawDeductionsId(): string {
    return this.pension_type_law_deductions_id;
  }

  getPensionDeduction(): string {
    return this.pension_deduction;
  }

  getDeductionsTotal(): string {
    return this.deductions_total;
  }

  getEpsBaseValue(): string | undefined {
    return this.eps_base_value;
  }

  getPensionBaseValue(): string | undefined {
    return this.pension_base_value;
  }

  getFondosspTypeLawDeductionsId(): string | undefined {
    return this.fondossp_type_law_deductions_id;
  }

  getFondospDeductionSP(): string | undefined {
    return this.fondosp_deduction_SP;
  }

  getFondosspSubTypeLawDeductionsId(): string | undefined {
    return this.fondossp_sub_type_law_deductions_id;
  }

  getFondospDeductionSub(): string | undefined {
    return this.fondosp_deduction_sub;
  }

  getLaborUnion(): LaborUnionDto[] | undefined {
    return this.labor_union;
  }

  getSanctions(): SanctionDto[] | undefined {
    return this.sanctions;
  }

  getOrders(): OrderDto[] | undefined {
    return this.orders;
  }

  getVoluntaryPension(): string | undefined {
    return this.voluntary_pension;
  }

  getWithholdingAtSource(): string | undefined {
    return this.withholding_at_source;
  }

  getAfc(): string | undefined {
    return this.afc;
  }

  getCooperative(): string | undefined {
    return this.cooperative;
  }

  getTaxLiens(): string | undefined {
    return this.tax_liens;
  }

  getSupplementaryPlan(): string | undefined {
    return this.supplementary_plan;
  }

  getEducation(): string | undefined {
    return this.education;
  }

  getRefund(): string | undefined {
    return this.refund;
  }

  getDebt(): string | undefined {
    return this.debt;
  }

  getThirdPartyPayments(): ThirdPartyPaymentDto[] | undefined {
    return this.third_party_payments;
  }

  getAdvances(): AdvanceDto[] | undefined {
    return this.advances;
  }

  getOtherDeductions(): OtherDeductionDto[] | undefined {
    return this.other_deductions;
  }

  // Setters
  setFondosspTypeLawDeductionsId(value: string): void {
    this.fondossp_type_law_deductions_id = value;
  }

  setFondospDeductionSP(value: string): void {
    if (value !== '0.00') {
      this.fondosp_deduction_SP = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setFondosspSubTypeLawDeductionsId(value: string): void {
    this.fondossp_sub_type_law_deductions_id = value;
  }

  setFondospDeductionSub(value: string): void {
    if (value !== '0.00') {
      this.fondosp_deduction_sub = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setLaborUnion(value: LaborUnionDto[]): void {
    this.labor_union = value;
    this.deductions_total = this.formatNumber(
      this.parseDouble(this.deductions_total) + this.parseDouble(value[0].getDeduction())
    );
  }

  setSanctions(value: SanctionDto[]): void {
    this.sanctions = value;
    this.deductions_total = this.formatNumber(
      this.parseDouble(this.deductions_total) + 
      this.parseDouble(value[0].getPrivateSanction()) +
      this.parseDouble(value[0].getPublicSanction())
    );
  }

  setOrders(value: OrderDto[]): void {
    this.orders = value;
    this.deductions_total = this.formatNumber(
      this.parseDouble(this.deductions_total) + this.parseDouble(value[0].getDeduction())
    );
  }

  setVoluntaryPension(value: string): void {
    if (value !== '0.00') {
      this.voluntary_pension = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setWithholdingAtSource(value: string): void {
    if (value !== '0.00') {
      this.withholding_at_source = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setAfc(value: string): void {
    if (value !== '0.00') {
      this.afc = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setCooperative(value: string): void {
    if (value !== '0.00') {
      this.cooperative = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setTaxLiens(value: string): void {
    if (value !== '0.00') {
      this.tax_liens = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setSupplementaryPlan(value: string): void {
    if (value !== '0.00') {
      this.supplementary_plan = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setEducation(value: string): void {
    if (value !== '0.00') {
      this.education = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setRefund(value: string): void {
    if (value !== '0.00') {
      this.refund = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setDebt(value: string): void {
    if (value !== '0.00') {
      this.debt = value;
      this.deductions_total = this.formatNumber(
        this.parseDouble(this.deductions_total) + this.parseDouble(value)
      );
    }
  }

  setThirdPartyPayments(value: ThirdPartyPaymentDto[]): void {
    this.third_party_payments = value;
    this.deductions_total = this.formatNumber(
      this.parseDouble(this.deductions_total) + this.parseDouble(value[0].getThirdPartyPayment())
    );
  }

  setAdvances(value: AdvanceDto[]): void {
    this.advances = value;
    this.deductions_total = this.formatNumber(
      this.parseDouble(this.deductions_total) + this.parseDouble(value[0].getAdvance())
    );
  }

  setOtherDeductions(value: OtherDeductionDto[]): void {
    this.other_deductions = value;
    this.deductions_total = this.formatNumber(
      this.parseDouble(this.deductions_total) + this.parseDouble(value[0].getOtherDeduction())
    );
  }
} 