import { Inject, Injectable } from '@nestjs/common';
import { EmailProvider } from './email.provider';
import { EmailRequestInterface } from './interface/email-request.interface';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(EmailProvider)
    public readonly emailProvider: EmailProvider
  ) {}

  public async sendEmail(emailRequest: EmailRequestInterface) {
    return this.emailProvider.sendEmail(emailRequest);
  }
}
