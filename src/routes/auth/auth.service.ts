import { Body, Injectable, NotFoundException, Post } from '@nestjs/common';
import {
  LoginDTO,
  LoginResponse,
  RegisterDTO,
  RegisterResponse,
} from './auth.dto';
import { Rescuer } from '../../schemas/rescuer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  cryptPassword,
  generateToken,
  verifyPassword,
} from '../../utils/crypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async register(body: RegisterDTO): Promise<RegisterResponse> {
    const passwordEncrypted = cryptPassword(body.password);

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
        verified: false,
        lastCodeSent: null,
        code: null,
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
    const token = generateToken(user._id);
    return {
      accessToken: 'Baerer ' + token,
    };
  }
}
