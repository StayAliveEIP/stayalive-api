import { Controller, Logger } from '@nestjs/common';
import { MailJetService } from "./mailjet.service";

@Controller()
export class MailJetController {
  private readonly logger = new Logger(MailJetService.name);

  constructor(private readonly appService: MailJetService) {}
}
