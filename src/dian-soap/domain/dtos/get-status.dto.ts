export class GetStatusDto {
  trackId: string;

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