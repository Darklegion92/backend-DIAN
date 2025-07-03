/**
 * DTO para la respuesta de datos del predecesor del servicio externo
 */
export class PredecessorDto {
  private predecessor_number: string;
  private predecessor_cune: string;
  private predecessor_issue_date: string;

  constructor(
    predecessor_number: string,
    predecessor_cune: string,
    predecessor_issue_date: string
  ) {
    this.predecessor_number = predecessor_number;
    this.predecessor_cune = predecessor_cune;
    this.predecessor_issue_date = predecessor_issue_date;
  }

  getPredecessorNumber(): string {
    return this.predecessor_number;
  }

  getPredecessorCune(): string {
    return this.predecessor_cune;
  }

  getPredecessorIssueDate(): string {
    return this.predecessor_issue_date;
  }

  setPredecessorNumber(predecessor_number: string): void {
    this.predecessor_number = predecessor_number;
  }

  setPredecessorCune(predecessor_cune: string): void {
    this.predecessor_cune = predecessor_cune;
  }

  setPredecessorIssueDate(predecessor_issue_date: string): void {
    this.predecessor_issue_date = predecessor_issue_date;
  }
} 