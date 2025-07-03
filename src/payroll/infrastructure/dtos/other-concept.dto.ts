/**
 * DTO para la respuesta de otros conceptos del servicio externo
 */
export class OtherConceptDto {
  private readonly salary_concept: string;
  private readonly non_salary_concept: string;
  private readonly description_concept: string;

  constructor(salaryConcept: string, nonSalaryConcept: string, descriptionConcept: string) {
    this.salary_concept = salaryConcept;
    this.non_salary_concept = nonSalaryConcept;
    this.description_concept = descriptionConcept;
  }

  getSalaryConcept(): string {
    return this.salary_concept;
  }

  getNonSalaryConcept(): string {
    return this.non_salary_concept;
  }

  getDescriptionConcept(): string {
    return this.description_concept;
  }
} 