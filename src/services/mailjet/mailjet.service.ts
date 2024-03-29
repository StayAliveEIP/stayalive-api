import { Injectable, Logger } from '@nestjs/common';
import * as Mailjet from 'node-mailjet';
import { LibraryResponse } from 'node-mailjet';
import { ClientParams } from 'node-mailjet/declarations/client/Client';
import { RequestData } from 'node-mailjet/declarations/request/Request';

export interface ISendEmailParam {
  from: {
    email: string;
    name: string;
  };
  to: {
    email: string;
    name: string;
  };
  subject: string;
  rawBody: string;
  isHtml: boolean;
}

@Injectable()
export class MailJetService {
  private readonly logger: Logger = new Logger(MailJetService.name);
  private readonly mailjet: Mailjet.Client;

  constructor() {
    const mailJetClientParam: ClientParams = {
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_API_SECRET,
    };
    this.mailjet = new Mailjet.Client(mailJetClientParam);
  }

  async sendEmail(
    param: ISendEmailParam,
  ): Promise<LibraryResponse<RequestData>> {
    return await this.mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: param.from.email,
            Name: param.from.name,
          },
          To: [
            {
              Email: param.to.email,
              Name: param.to.name,
            },
          ],
          Subject: param.subject,
          TextPart: param.isHtml ? undefined : param.rawBody,
          HTMLPart: param.isHtml ? param.rawBody : undefined,
        },
      ],
    });
  }
}
