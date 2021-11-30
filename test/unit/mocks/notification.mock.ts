import { EmailRequestInterface } from 'modules/notification/interface/email-request.interface';

export const getEmailRequestMock = (): EmailRequestInterface => {
  return {
    to: ['email@email.com'],
    subject: 'teste',
    html: 'teste'
  };
};
