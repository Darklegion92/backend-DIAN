import { BadRequestException } from '@nestjs/common';

export class ExternalValidationException extends BadRequestException {
  constructor(
    message: string,
    public readonly validationErrors: Record<string, string[]>,
  ) {
    super({
      message,
      errors: validationErrors,
      statusCode: 400,
    });
  }

  getValidationErrors(): Record<string, string[]> {
    return this.validationErrors;
  }

  getFormattedErrors(): string {
    return Object.entries(this.validationErrors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ');
  }
} 