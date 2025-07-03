/**
 * DTO para la respuesta de anticipos del servicio externo
 */
export class AdvanceDto {
  private readonly advance: string;

  constructor(advance: string) {
    this.advance = advance;
  }

  getAdvance(): string {
    return this.advance;
  }
} 