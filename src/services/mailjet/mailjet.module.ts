import { Module } from '@nestjs/common';
import { MailJetService } from './mailjet.service';

@Module({
  providers: [MailJetService],
  exports: [MailJetService],
})
export class MailJetModule {}
