import { Module } from '@nestjs/common';
import { MailJetController } from './mailjet.controller';
import { MailJetService } from './mailjet.service';

@Module({
  imports: [],
  controllers: [MailJetController],
  providers: [MailJetService],
})
export class MailJetModule {}
