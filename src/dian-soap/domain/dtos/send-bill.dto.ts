export class SendBillDto {
  fileName: string;
  contentFile: string; // Base64 del XML

  constructor(data: any) {
    this.fileName = data?.fileName;
    this.contentFile = data?.contentFile;
  }

  isValid(): boolean {
    return !!this.fileName && !!this.contentFile;
  }

  toJSON() {
    return {
      fileName: this.fileName,
      contentFile: this.contentFile
    };
  }
} 