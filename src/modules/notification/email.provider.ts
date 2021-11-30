import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { EmailRequestInterface } from './interface/email-request.interface';

@Injectable()
export class EmailProvider {
  public async sendEmail(emailRequest: EmailRequestInterface): Promise<void> {
    return new Promise((resolve, reject) => {
      this.getTransporter().sendMail(emailRequest, (error) => {
        if (error) reject(error);
        resolve();
      });
    });
  }

  private getTransporter(): Transporter<SentMessageInfo> {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: +process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    return transporter;
  }
}
