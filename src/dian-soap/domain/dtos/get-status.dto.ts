export class GetStatusDtos {
  trackId: string;

  // TODO: Tipar data con una interfaz GetStatusDtoProps que defina la estructura esperada
  constructor(data: any) {
    this.trackId = data?.trackId;
  }

  isValid(): boolean {
    return !!this.trackId;
  }

  toJSON() {
    return {
      trackId: this.trackId
    };
  }
} 