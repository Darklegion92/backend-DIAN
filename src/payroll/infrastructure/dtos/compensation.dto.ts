/**
 * DTO para la respuesta de compensaciones del servicio externo
 */
export class CompensationDto {
  private readonly ordinary_compensation: string;
  private readonly extraordinary_compensation: string;

  constructor(ordinaryCompensation: string, extraordinaryCompensation: string) {
    this.ordinary_compensation = ordinaryCompensation;
    this.extraordinary_compensation = extraordinaryCompensation;
  }

  getOrdinaryCompensation(): string {
    return this.ordinary_compensation;
  }

  getExtraordinaryCompensation(): string {
    return this.extraordinary_compensation;
  }
} 