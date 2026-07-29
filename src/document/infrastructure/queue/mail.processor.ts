import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { DocumentService } from '../../infrastructure/services/document.service';

@Processor('mails_queue')
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private readonly documentService: DocumentService) {}

  @Process('send_email_job')
  async handleSendEmail(job: Job) {
    this.logger.log(`Procesando envío de correo de forma asíncrona (Job ID: ${job.id})`);
    try {
      const { sendEmailDto, currentUser } = job.data;
      await this.documentService.sendEmail(sendEmailDto, currentUser);
      this.logger.log(`Correo enviado correctamente (Job ID: ${job.id})`);
    } catch (error) {
      this.logger.error(`Error procesando envío de correo (Job ID: ${job.id}): ${error.message}`, error.stack);
      throw error;
    }
  }
}
