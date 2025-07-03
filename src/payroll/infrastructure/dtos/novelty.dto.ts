/**
 * DTO para la respuesta de novedades del servicio externo
 */
export class NoveltyDto {
  private readonly novelty: boolean;
  private readonly uuidnov: string;

  constructor() {
    this.novelty = false;
    this.uuidnov = "";
  }

  getNovelty(): boolean {
    return this.novelty;
  }

  getUuidnov(): string {
    return this.uuidnov;
  }
} 