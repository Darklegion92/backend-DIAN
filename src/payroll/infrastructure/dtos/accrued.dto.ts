import { HDto } from './h.dto';
import { CommonVacationDto } from './common-vacation.dto';
import { PaidVacationDto } from './paid-vacation.dto';
import { ServiceBonusDto } from './service-bonus.dto';
import { SeveranceDto } from './severance.dto';
import { WorkDisabilitiesDto } from './work-disabilities.dto';
import { NonPaidLeaveDto } from './non-paid-leave.dto';
import { BonusDto } from './bonus.dto';
import { AidDto } from './aid.dto';
import { OtherConceptDto } from './other-concept.dto';
import { CompensationDto } from './compensation.dto';
import { EpctvBonusDto } from './epctv-bonus.dto';
import { CommissionDto } from './commission.dto';
import { ThirdPartyPaymentDto } from './third-party-payment.dto';
import { AdvanceDto } from './advance.dto';

/**
 * DTO para manejar los devengados en la nómina electrónica
 * Contiene todos los conceptos que suman al total devengado por el empleado
 */
export class AccruedDto {
  private readonly worked_days: string;
  private readonly salary: string;
  private transportation_allowance?: string;
  private accrued_total: string;
  private salary_viatics?: string;
  private non_salary_viatics?: string;
  private HEDs?: HDto[];
  private HENs?: HDto[];
  private HRNs?: HDto[];
  private HEDDFs?: HDto[];
  private HRDDFs?: HDto[];
  private HENDFs?: HDto[];
  private HRNDFs?: HDto[];
  private common_vacation?: CommonVacationDto[];
  private paid_vacation?: PaidVacationDto[];
  private service_bonus?: ServiceBonusDto[];
  private severance?: SeveranceDto[];
  private work_disabilities?: WorkDisabilitiesDto[];
  private maternity_leave?: CommonVacationDto[];
  private paid_leave?: CommonVacationDto[];
  private non_paid_leave?: NonPaidLeaveDto[];
  private bonuses?: BonusDto[];
  private aid?: AidDto[];
  private legal_strike?: NonPaidLeaveDto[];
  private other_concepts?: OtherConceptDto[];
  private compensations?: CompensationDto[];
  private epctv_bonuses?: EpctvBonusDto[];
  private commissions?: CommissionDto[];
  private third_party_payments?: ThirdPartyPaymentDto[];
  private advances?: AdvanceDto[];
  private endowment?: string;
  private sustenance_support?: string;
  private telecommuting?: string;
  private withdrawal_bonus?: string;
  private compensation?: string;

  constructor(workedDays: string, salary: string) {
    this.worked_days = workedDays;
    this.salary = salary;
    this.accrued_total = this.formatNumber(this.parseDouble(salary));
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
  getWorkedDays(): string {
    return this.worked_days;
  }

  getSalary(): string {
    return this.salary;
  }

  getTransportationAllowance(): string | undefined {
    return this.transportation_allowance;
  }

  getAccruedTotal(): string {
    return this.accrued_total;
  }

  getSalaryViatics(): string | undefined {
    return this.salary_viatics;
  }

  getNonSalaryViatics(): string | undefined {
    return this.non_salary_viatics;
  }

  getHEDs(): HDto[] | undefined {
    return this.HEDs;
  }

  getHENs(): HDto[] | undefined {
    return this.HENs;
  }

  getHRNs(): HDto[] | undefined {
    return this.HRNs;
  }

  getHEDDFs(): HDto[] | undefined {
    return this.HEDDFs;
  }

  getHRDDFs(): HDto[] | undefined {
    return this.HRDDFs;
  }

  getHENDFs(): HDto[] | undefined {
    return this.HENDFs;
  }

  getHRNDFs(): HDto[] | undefined {
    return this.HRNDFs;
  }

  getCommonVacation(): CommonVacationDto[] | undefined {
    return this.common_vacation;
  }

  getPaidVacation(): PaidVacationDto[] | undefined {
    return this.paid_vacation;
  }

  getServiceBonus(): ServiceBonusDto[] | undefined {
    return this.service_bonus;
  }

  getSeverance(): SeveranceDto[] | undefined {
    return this.severance;
  }

  getWorkDisabilities(): WorkDisabilitiesDto[] | undefined {
    return this.work_disabilities;
  }

  getMaternityLeave(): CommonVacationDto[] | undefined {
    return this.maternity_leave;
  }

  getPaidLeave(): CommonVacationDto[] | undefined {
    return this.paid_leave;
  }

  getNonPaidLeave(): NonPaidLeaveDto[] | undefined {
    return this.non_paid_leave;
  }

  getBonuses(): BonusDto[] | undefined {
    return this.bonuses;
  }

  getAid(): AidDto[] | undefined {
    return this.aid;
  }

  getLegalStrike(): NonPaidLeaveDto[] | undefined {
    return this.legal_strike;
  }

  getOtherConcepts(): OtherConceptDto[] | undefined {
    return this.other_concepts;
  }

  getCompensations(): CompensationDto[] | undefined {
    return this.compensations;
  }

  getEpctvBonuses(): EpctvBonusDto[] | undefined {
    return this.epctv_bonuses;
  }

  getCommissions(): CommissionDto[] | undefined {
    return this.commissions;
  }

  getThirdPartyPayments(): ThirdPartyPaymentDto[] | undefined {
    return this.third_party_payments;
  }

  getAdvances(): AdvanceDto[] | undefined {
    return this.advances;
  }

  getEndowment(): string | undefined {
    return this.endowment;
  }

  getSustenanceSupport(): string | undefined {
    return this.sustenance_support;
  }

  getTelecommuting(): string | undefined {
    return this.telecommuting;
  }

  getWithdrawalBonus(): string | undefined {
    return this.withdrawal_bonus;
  }

  getCompensation(): string | undefined {
    return this.compensation;
  }

  // Setters
  setTransportationAllowance(value: string): void {
    if (value !== '0.00') {
      this.transportation_allowance = value;
      this.accrued_total = this.formatNumber(
        this.parseDouble(this.accrued_total) + this.parseDouble(value || '0')
      );
    }
  }

  setSalaryViatics(value: string): void {
    if (value !== '0.00') {
      this.salary_viatics = value;
      this.accrued_total = this.formatNumber(
        this.parseDouble(this.accrued_total) + this.parseDouble(value || '0')
      );
    }
  }

  setNonSalaryViatics(value: string): void {
    if (value !== '0.00') {
      this.non_salary_viatics = value;
      this.accrued_total = this.formatNumber(
        this.parseDouble(this.accrued_total) + this.parseDouble(value || '0')
      );
    }
  }

  setHEDs(value: HDto[]): void {
    this.HEDs = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setHENs(value: HDto[]): void {
    this.HENs = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setHRNs(value: HDto[]): void {
    this.HRNs = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setHEDDFs(value: HDto[]): void {
    this.HEDDFs = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setHRDDFs(value: HDto[]): void {
    this.HRDDFs = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setHENDFs(value: HDto[]): void {
    this.HENDFs = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setHRNDFs(value: HDto[]): void {
    this.HRNDFs = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setCommonVacation(value: CommonVacationDto[]): void {
    this.common_vacation = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setPaidVacation(value: PaidVacationDto[]): void {
    this.paid_vacation = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setServiceBonus(value: ServiceBonusDto[]): void {
    this.service_bonus = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setSeverance(value: SeveranceDto[]): void {
    this.severance = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + 
      this.parseDouble(value[0]?.getPayment() || '0') +
      this.parseDouble(value[0]?.getInterestPayment() || '0')
    );
  }

  setWorkDisabilities(value: WorkDisabilitiesDto[]): void {
    this.work_disabilities = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setMaternityLeave(value: CommonVacationDto[]): void {
    this.maternity_leave = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setPaidLeave(value: CommonVacationDto[]): void {
    this.paid_leave = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getPayment() || '0')
    );
  }

  setNonPaidLeave(value: NonPaidLeaveDto[]): void {
    this.non_paid_leave = value;
  }

  setBonuses(value: BonusDto[]): void {
    this.bonuses = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + 
      this.parseDouble(value[0]?.getNonSalaryBonus() || '0') +
      this.parseDouble(value[0]?.getSalaryBonus() || '0')
    );
  }

  setAid(value: AidDto[]): void {
    this.aid = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + 
      this.parseDouble(value[0]?.getNonSalaryAssistance() || '0') +
      this.parseDouble(value[0]?.getSalaryAssistance() || '0')
    );
  }

  setLegalStrike(value: NonPaidLeaveDto[]): void {
    this.legal_strike = value;
  }

  setOtherConcepts(value: OtherConceptDto[]): void {
    this.other_concepts = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + 
      this.parseDouble(value[0]?.getNonSalaryConcept() || '0') +
      this.parseDouble(value[0]?.getSalaryConcept() || '0')
    );
  }

  setCompensations(value: CompensationDto[]): void {
    this.compensations = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + 
      this.parseDouble(value[0]?.getExtraordinaryCompensation() || '0') +
      this.parseDouble(value[0]?.getOrdinaryCompensation() || '0')
    );
  }

  setEpctvBonuses(value: EpctvBonusDto[]): void {
    this.epctv_bonuses = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + 
      this.parseDouble(value[0]?.getNonSalaryFoodPayment() || '0') +
      this.parseDouble(value[0]?.getPaymentNS() || '0') +
      this.parseDouble(value[0]?.getPaymentS() || '0') +
      this.parseDouble(value[0]?.getSalaryFoodPayment() || '0')
    );
  }

  setCommissions(value: CommissionDto[]): void {
    this.commissions = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getCommission() || '0')
    );
  }

  setThirdPartyPayments(value: ThirdPartyPaymentDto[]): void {
    this.third_party_payments = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getThirdPartyPayment() || '0')
    );
  }

  setAdvances(value: AdvanceDto[]): void {
    this.advances = value;
    this.accrued_total = this.formatNumber(
      this.parseDouble(this.accrued_total) + this.parseDouble(value[0]?.getAdvance() || '0')
    );
  }

  setEndowment(value: string): void {
    if (value !== '0.00') {
      this.endowment = value;
      this.accrued_total = this.formatNumber(
        this.parseDouble(this.accrued_total) + this.parseDouble(value || '0')
      );
    }
  }

  setSustenanceSupport(value: string): void {
    if (value !== '0.00') {
      this.sustenance_support = value;
      this.accrued_total = this.formatNumber(
        this.parseDouble(this.accrued_total) + this.parseDouble(value || '0')
      );
    }
  }

  setTelecommuting(value: string): void {
    if (value !== '0.00') {
      this.telecommuting = value;
      this.accrued_total = this.formatNumber(
        this.parseDouble(this.accrued_total) + this.parseDouble(value || '0')
      );
    }
  }

  setWithdrawalBonus(value: string): void {
    if (value !== '0.00') {
      this.withdrawal_bonus = value;
      this.accrued_total = this.formatNumber(
        this.parseDouble(this.accrued_total) + this.parseDouble(value || '0')
      );
    }
  }

  setCompensation(value: string): void {
    if (value !== '0.00') {
      this.compensation = value;
      this.accrued_total = this.formatNumber(
        this.parseDouble(this.accrued_total) + this.parseDouble(value || '0')
      );
    }
  }

  setAccruedTotal(value: string): void {
    this.accrued_total = value;
  }
} 