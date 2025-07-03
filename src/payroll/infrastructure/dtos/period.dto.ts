/**
 * DTO para la respuesta de período del servicio externo
 */
export class PeriodDto {
  // NOEL_FECING
  private readonly admision_date: string;
  // NO APLICA
  private retirement_date: string;
  // NOEL_MES NOEL_ANO
  private readonly settlement_start_date: string;
  // NOEL_MES NOEL_ANO
  private readonly settlement_end_date: string;
  // NOEL_DIASTOT
  private readonly worked_time: string;
  // NOEL_FECRET
  private readonly issue_date: string;

  constructor(
    admisionDate: string,
    settlementStartDate: string,
    settlementEndDate: string,
    workedTime: string,
    issueDate: string
  ) {
    this.admision_date = admisionDate;
    this.settlement_start_date = settlementStartDate;
    this.settlement_end_date = settlementEndDate;
    this.worked_time = workedTime;
    this.issue_date = issueDate;
  }

  getAdmisionDate(): string {
    return this.admision_date;
  }

  getSettlementStartDate(): string {
    return this.settlement_start_date;
  }

  getSettlementEndDate(): string {
    return this.settlement_end_date;
  }

  getWorkedTime(): string {
    return this.worked_time;
  }

  getIssueDate(): string {
    return this.issue_date;
  }

  getRetirementDate(): string {
    return this.retirement_date;
  }

  setRetirementDate(retirementDate: string): void {
    this.retirement_date = retirementDate;
  }
} 