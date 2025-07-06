export enum DocumentType {
  INVOICE = 'INVOICE',
  CREDIT_NOTE = 'CREDIT_NOTE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  PAYROLL = 'PAYROLL'
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export class Document {
  constructor(
    public readonly trackId: string,
    public readonly fileName: string,
    public readonly contentFile: string,
    public readonly type: DocumentType,
    public status: DocumentStatus = DocumentStatus.PENDING,
    public readonly createdAt: Date = new Date(),
    public processedMessage?: string,
    public statusMessage?: string
  ) {}

  updateStatus(status: DocumentStatus, message?: string) {
    this.status = status;
    if (message) {
      this.statusMessage = message;
    }
  }

  toResponse() {
    return {
      processedMessage: this.processedMessage || '',
      statusCode: this.status,
      statusDescription: this.status,
      statusMessage: this.statusMessage || ''
    };
  }
} 