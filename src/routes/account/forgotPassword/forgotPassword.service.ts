import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ForgotPasswordLinkDTO,
  ForgotPasswordLinkResponse,
  ForgotPasswordResetDTO,
  ForgotPasswordResetResponse,
} from './forgotPassword.dto';
import {
  ISendEmailParam,
  MailJetService,
} from '../../../services/mailjet/mailjet.service';
import { cryptPassword } from '../../../utils/crypt';
import { Rescuer } from '../../../database/rescuer.schema';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    private readonly mailjetService: MailJetService,
  ) {}

  async index(
    body: ForgotPasswordLinkDTO,
  ): Promise<ForgotPasswordLinkResponse> {
    // Verify if a code was not already sent in the last 5 minutes
    const rescuer: Rescuer = await this.rescuerModel.findOne({
      'email.email': body.email,
    });
    if (!rescuer)
      throw new NotFoundException("Aucun compte n'existe avec cet email.");
    const lastCodeSent: Date = new Date(rescuer.password.lastTokenSent);
    const now: Date = new Date();
    const diff: number = now.getTime() - lastCodeSent.getTime();
    const diffMinutes: number = Math.floor(diff / 1000 / 60);
    if (diffMinutes < 5)
      throw new ForbiddenException(
        'Un code a déjà été envoyé il y a moins de 5 minutes.',
      );
    // Generate random alphanumeric string of 30 characters
    const token: string =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    // Insert the code into the database
    await this.rescuerModel.updateOne(
      { 'email.email': body.email },
      {
        'password.token': token,
        'password.lastTokenSent': new Date(),
      },
    );
    const sendEmailParam: ISendEmailParam = {
      from: {
        email: 'noreply@stayalive.tech',
        name: 'StayAlive',
      },
      to: {
        email: body.email,
        name: rescuer.firstname + ' ' + rescuer.lastname.toUpperCase(),
      },
      subject: 'Réinitialisation de votre mot de passe',
      isHtml: false,
      rawBody: 'Votre code de réinitialisation est : ' + token + '.',
    };
    this.mailjetService.sendEmailAsync(sendEmailParam);
    return {
      message:
        'Un email vous a été envoyé pour réinitialiser votre mot de passe.',
    };
  }

  async reset(
    body: ForgotPasswordResetDTO,
  ): Promise<ForgotPasswordResetResponse> {
    // Check if a user exist with this code.
    const token: string = body.token;
    const rescuer: Rescuer = await this.rescuerModel.findOne({
      'password.token': token,
    });
    if (!rescuer)
      throw new NotFoundException(
        "Aucun compte n'existe avec ce code de réinitialisation.",
      );
    // Check if the code is not expired
    const lastCodeSent: Date = new Date(rescuer.password.lastTokenSent);
    const now: Date = new Date();
    const diff: number = now.getTime() - lastCodeSent.getTime();
    const diffHours: number = Math.floor(diff / 1000 / 60 / 60);
    if (diffHours > 24) {
      throw new ForbiddenException(
        'Le code de réinitialisation a expiré, veuillez en demander un nouveau.',
      );
    }
    const password: string = body.password;
    const encryptedPassword: string = cryptPassword(password);
    await this.rescuerModel.updateOne(
      { 'password.token': token },
      {
        'password.password': encryptedPassword,
        'password.token': null,
        'password.lastTokenSent': null,
        'password.lastChange': null,
      },
    );
    return {
      message: 'Votre mot de passe a bien été réinitialisé.',
    };
  }
}
