import { Module } from '@nestjs/common';
import { EmailProvider } from './email.provider';
import { NotificationService } from './notification.service';

@Module({
  imports: [],
  controllers: [],
  providers: [NotificationService, EmailProvider],
  exports: [NotificationService]
})
export class NotificationModule {}
