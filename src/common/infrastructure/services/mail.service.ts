import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
import { CompanyWithCertificateDto } from '@/company/presentation/dtos/company-with-certificate.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  async sendMailWithCompanyConfig(
    company: CompanyWithCertificateDto,
    to: string | string[],
    subject: string,
    html: string,
    attachments: Attachment[],
  ) {
    if (
      !company.mailHost ||
      !company.mailPort ||
      !company.mailUsername ||
      !company.mailPassword ||
      !company.mailFromAddress ||
      !company.mailFromName
    ) {
      const errorMessage = `Configuración de correo (SMTP) incompleta para la compañía ${company.identificationNumber}`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const transporter = nodemailer.createTransport({
      host: company.mailHost,
      port: company.mailPort,
      secure: company.mailEncryption?.toLowerCase() === 'ssl' || Number(company.mailPort) === 465,
      auth: {
        user: company.mailUsername,
        pass: company.mailPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"${company.mailFromName}" <${company.mailFromAddress}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject: subject,
      html: html,
      attachments: attachments,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      const recipients = Array.isArray(to) ? to.join(', ') : to;
      this.logger.log(`Correo enviado a ${recipients} con asunto "${subject}". MessageId: ${info.messageId}`);
      return info;
    } catch (error) {
      const recipients = Array.isArray(to) ? to.join(', ') : to;
      this.logger.error(`Error al enviar correo a ${recipients}`, error);
      throw error;
    }
  }
} 