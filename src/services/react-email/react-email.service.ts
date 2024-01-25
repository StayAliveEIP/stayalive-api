import { Injectable, Logger } from '@nestjs/common';
import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';
import * as mailjetTransport from 'nodemailer-mailjet-transport';
import { VerifyAccountEmail } from './templates/stayalive-verify-account';
import MagicLinkMail from './templates/stayalive-connexion-link';
import AccountCreatedMailPassword from './templates/stayalive-password-account';
import MailForgotPasswordCode from './templates/stayalive-forgot-password-code';
import MailVerifyEmailCode from './templates/stayalive-verify-email-code';

@Injectable()
export class ReactEmailService {
  public transporter: nodemailer.Transporter;
  private logger: Logger = new Logger(ReactEmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport(
      mailjetTransport({
        auth: {
          apiKey: process.env.MAILJET_API_KEY,
          apiSecret: process.env.MAILJET_API_SECRET,
        },
      }),
    );
  }

  sendVerifyAccountEmail(email: string, username: string, link: string) {
    const html = render(
      VerifyAccountEmail({
        username: username,
        inviteLink: link,
      }),
    );
    const mailOptions = {
      from: 'noreply@stayalive.fr',
      to: email,
      subject: 'Vérification de votre compte StayAlive',
      html: html,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  sendMagicLinkEmail(email: string, username: string, link: string) {
    const html = render(
      MagicLinkMail({
        username: username,
        authLink: link,
      }),
    );
    const mailOptions = {
      from: 'noreply@stayalive.fr',
      to: email,
      subject: 'Connecter vous avec le lien',
      html: html,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  sendMailCreatedAccountPassword(
    email: string,
    username: string,
    password: string,
  ) {
    this.logger.debug('Send a mail to ' + email + ' with password ' + password);
    const html = render(
      AccountCreatedMailPassword({
        username: username,
        password: password,
      }),
    );
    const mailOptions = {
      from: 'noreply@stayalive.fr',
      to: email,
      subject: "Votre compte StayAlive Centre d'appel a été créé",
      html: html,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      console.log('sendMailCreatedAccountPassword');
      if (error) {
        console.log(error);
      }
    });
  }

  sendMailForgotPasswordCode(email: string, username: string, code: string) {
    const html = render(
      MailForgotPasswordCode({
        username: username,
        validationCode: code,
      }),
    );
    const mailOptions = {
      from: 'noreply@stayalive.fr',
      to: email,
      subject: 'Réinitialisation de votre mot de passe StayAlive',
      html: html,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  sendMailVerifyEmailCode(email: string, username: string, code: string) {
    const html = render(
      MailVerifyEmailCode({
        username: username,
        validationCode: code,
      }),
    );
    const mailOptions = {
      from: 'noreply@stayalive.fr',
      to: email,
      subject: 'Réinitialisation de votre mot de passe StayAlive',
      html: html,
    };
    this.transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }
}
