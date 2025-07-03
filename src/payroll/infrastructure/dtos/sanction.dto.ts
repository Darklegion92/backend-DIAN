/**
 * DTO para la respuesta de sanciones del servicio externo
 */
export class SanctionDto {
  private readonly public_sanction: string;
  private readonly private_sanction: string;

  constructor(privateSanction: string) {
    this.private_sanction = privateSanction;
  }

  getPublicSanction(): string {
    return this.public_sanction;
  }

  getPrivateSanction(): string {
    return this.private_sanction;
  }
} 