import { Test } from '@nestjs/testing';
import { EmailProvider } from 'modules/notification/email.provider';
import { NotificationService } from 'modules/notification/notification.service';
import { getEmailRequestMock } from './mocks/notification.mock';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let emailProvider: EmailProvider;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: EmailProvider,
          useValue: {
            sendEmail: jest.fn()
          }
        }
      ]
    }).compile();

    notificationService = module.get(NotificationService);
    emailProvider = module.get(EmailProvider);

    jest.spyOn(emailProvider, 'sendEmail').mockResolvedValue(null);
  });

  describe('sendEmail', () => {
    it('should send an email', async () => {
      const emailRequest = getEmailRequestMock();

      await notificationService.sendEmail(emailRequest);

      expect(emailProvider.sendEmail).toBeCalledWith(emailRequest);
    });

    it('should return error when email delivery fail', async () => {
      jest.spyOn(emailProvider, 'sendEmail').mockRejectedValueOnce(new Error());

      await expect(
        notificationService.sendEmail(getEmailRequestMock())
      ).rejects.toThrow(Error);
    });
  });
});
