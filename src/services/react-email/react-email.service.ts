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
    const subject = 'Vérification de votre compte StayAlive';
    const html = render(
      VerifyAccountEmail({
        username: username,
        inviteLink: link,
      }),
    );
    this.sendEmail(email, subject, html);
  }

  sendMagicLinkEmail(email: string, username: string, link: string) {
    const html = render(
      MagicLinkMail({
        username: username,
        authLink: link,
      }),
    );
    const subject = 'Connecter vous avec le lien';
    this.sendEmail(email, subject, html);
  }

  sendMailCreatedAccountPassword(
    email: string,
    username: string,
    password: string,
  ) {
    this.logger.debug('Send a mail to ' + email + ' with password ' + password);
    const subject = "Votre compte StayAlive Centre d'appel a été créé";
    const html = render(
      AccountCreatedMailPassword({
        username: username,
        password: password,
      }),
    );
    this.sendEmail(email, subject, html);
  }

  sendMailForgotPasswordCode(email: string, username: string, code: string) {
    const subject = 'Réinitialisation de votre mot de passe StayAlive';
    const html = render(
      MailForgotPasswordCode({
        username: username,
        validationCode: code,
      }),
    );
    this.sendEmail(email, subject, html);
  }

  sendMailVerifyEmailCode(email: string, username: string, code: string) {
    const subject = 'Confirmation de votre adresse email StayAlive';
    const html = render(
      MailVerifyEmailCode({
        username: username,
        validationCode: code,
      }),
    );
    this.sendEmail(email, subject, html);
  }

  private sendEmail(email: string, subject: string, html: string) {
    try {
      const mailOptions = {
        from: process.env.MAILJET_SENDER_EMAIL,
        to: email,
        subject: subject,
        html: html,
      };
      this.transporter.sendMail(mailOptions, (error) => {
        if (error) {
          this.logger.error(error);
        } else {
          this.logger.debug('Email sent to ' + email);
        }
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
