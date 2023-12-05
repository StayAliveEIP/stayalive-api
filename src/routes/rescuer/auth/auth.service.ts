import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LoginDTO,
  LoginResponse,
  RegisterDTO,
  RegisterResponse,
  SendMagicLinkRequest,
} from './auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  hashPassword,
  generateToken,
  verifyPassword,
} from '../../../utils/crypt.utils';
import { Rescuer } from '../../../database/rescuer.schema';
import { AccountType } from '../../../guards/auth.guard';
import { SuccessMessage } from '../../../dto.dto';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    private readonly reactEmailService: ReactEmailService,
  ) {}

  async register(body: RegisterDTO): Promise<RegisterResponse> {
    const passwordEncrypted: string = hashPassword(body.password);

    const user: Rescuer = await this.rescuerModel.findOne({
      'email.email': body.email,
    });
    if (user) {
      throw new NotFoundException('Un compte existe déjà avec cet email.');
    }

    const rescuer: Rescuer = {
      _id: new Types.ObjectId(),
      firstname: body.firstname,
      lastname: body.lastname.toUpperCase(),
      email: {
        email: body.email,
        verified: false,
        lastCodeSent: null,
        code: null,
      },
      phone: {
        phone: body.phone,
        verified: false,
        lastCodeSent: null,
        code: null,
      },
      password: {
        password: passwordEncrypted,
        token: null,
        lastTokenSent: null,
        lastChange: null,
      },
    };
    await this.rescuerModel.create(rescuer);
    return {
      message:
        'Votre compte à bien été enregistré, vous pouvez maintenant vous connecter !',
    };
  }

  /**
   * This method login a user and return a token if the user is found
   * and the password is correct.
   * @param body The body of the request.
   */
  async login(body: LoginDTO): Promise<LoginResponse> {
    const user: Rescuer = await this.rescuerModel.findOne({
      'email.email': body.email,
    });
    if (!user) {
      throw new NotFoundException(
        "L'utilisateur est introuvable avec cet email",
      );
    }
    if (!verifyPassword(user.password.password, body.password)) {
      throw new NotFoundException(
        'Le mot de passe est incorrect pour ce compte.',
      );
    }
    const token = generateToken(user._id, AccountType.RESCUER);
    return {
      accessToken: 'Bearer ' + token,
    };
  }

  async sendMagicLink(body: SendMagicLinkRequest): Promise<SuccessMessage> {
    const user: Rescuer = await this.rescuerModel.findOne({
      'email.email': body.email,
    });
    if (!user) {
      throw new NotFoundException(
        "L'utilisateur est introuvable avec cet email",
      );
    }
    const token = generateToken(user._id, AccountType.RESCUER);
    const frontUrl = process.env.FRONTEND_URL;
    const _finalUrl = `${frontUrl}/auth/magiclogin?token=${token}`;
    // TODO: Send email
    this.reactEmailService.sendMagicLinkEmail(
      body.email,
      user.firstname,
      _finalUrl,
    );
    return {
      message: 'Un lien magique vous a été envoyé par email.',
    };
  }
}
