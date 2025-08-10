/**
 * DTO para la respuesta de novedades del servicio externo
 */
export class NoveltyDto {
  private readonly novelty: boolean;
  private readonly uuidnov: string;

  constructor(novelty: boolean = false) {
    this.novelty = novelty;
    this.uuidnov = "";
  }

  getNovelty(): boolean {
    return this.novelty;
  }

  getUuidnov(): string {
    return this.uuidnov;
  }
  
} 