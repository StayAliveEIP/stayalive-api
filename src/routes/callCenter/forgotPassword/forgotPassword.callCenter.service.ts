import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CallCenter } from '../../../database/callCenter.schema';
import { Model } from 'mongoose';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { SuccessMessage } from '../../../dto.dto';
import { hashPassword } from '../../../utils/crypt.utils';
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './forgotPassword.callCenter.dto';

@Injectable()
export class ForgotPasswordCallCenterService {
  constructor(
    @InjectModel(CallCenter.name) private callCenterModel: Model<CallCenter>,
    private readonly reactEmailService: ReactEmailService,
  ) {}

  async forgotPassword(body: ForgotPasswordRequest): Promise<SuccessMessage> {
    const user = await this.callCenterModel.findOne({
      'email.email': body.email,
    });
    if (!user) {
      throw new NotFoundException(
        "Le centre d'appel est introuvable avec cet email",
      );
    }
    const lastCodeSent: Date = new Date(user.password.lastTokenSent);
    const diff: number = new Date().getTime() - lastCodeSent.getTime();
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
    user.password.lastTokenSent = new Date();
    user.password.token = token;
    await user.save();
    // Send the email
    this.reactEmailService.sendMailForgotPasswordCode(
      user.email.email,
      user.name,
      token,
    );
    return {
      message: 'Un code de réinitialisation vous a été envoyé par email.',
    };
  }

  async resetPassword(body: ResetPasswordRequest): Promise<SuccessMessage> {
    // Check if a user exist with this code.
    const token: string = body.token;
    const user = await this.callCenterModel.findOne({
      'password.token': token,
    });
    if (!user)
      throw new NotFoundException(
        "Aucun compte n'existe avec ce code de réinitialisation.",
      );
    // Check if the code is not expired
    const lastCodeSent: Date = new Date(user.password.lastTokenSent);
    const now: Date = new Date();
    const diff: number = now.getTime() - lastCodeSent.getTime();
    const diffHours: number = Math.floor(diff / 1000 / 60 / 60);
    if (diffHours > 24) {
      throw new ForbiddenException(
        'Le code de réinitialisation a expiré, veuillez en demander un nouveau.',
      );
    }
    const password: string = body.password;
    user.password.password = hashPassword(password);
    user.password.token = null;
    user.password.lastTokenSent = null;
    user.password.lastChange = new Date();
    await user.save();
    return {
      message: 'Votre mot de passe a bien été réinitialisé.',
    };
  }
}
