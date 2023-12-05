import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import * as nodemailer from 'nodemailer';
import * as mailjetTransport from 'nodemailer-mailjet-transport';
import { VerifyAccountEmail } from './templates/stayalive-verify-account';
import MagicLinkMail from './templates/stayalive-connexion-link';
import AccountCreatedMailPassword from './templates/stayalive-password-account';

@Injectable()
export class ReactEmailService {
  private transporter: nodemailer.Transporter;
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
    this.transporter.sendMail(mailOptions, (error, info) => {
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
      subject: 'Vérification de votre compte StayAlive',
      html: html,
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
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
    this.transporter.sendMail(mailOptions, (error, info) => {
      console.log('sendMailCreatedAccountPassword');
      if (error) {
        console.log(error);
      }
    });
  }
}
