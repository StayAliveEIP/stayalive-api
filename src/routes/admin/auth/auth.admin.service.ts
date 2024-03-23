import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../../database/admin.schema';
import { LoginAdminRequest, LoginAdminResponse } from './auth.admin.dto';
import { generateToken, verifyPassword } from '../../../utils/crypt.utils';
import { AccountType } from '../../../guards/auth.route.guard';
import { SendMagicLinkRequest } from '../../rescuer/auth/auth.dto';
import { SuccessMessage } from '../../../dto.dto';
import { Rescuer } from '../../../database/rescuer.schema';
import process from 'process';
import { ReactEmailService } from '../../../services/react-email/react-email.service';

@Injectable()
export class AuthAdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private readonly reactEmailService: ReactEmailService,
  ) {}

  async login(body: LoginAdminRequest): Promise<LoginAdminResponse> {
    // Find the admin
    const admin = await this.adminModel.findOne({
      'email.email': body.email,
    });
    if (!admin) {
      throw new NotFoundException("L'administrateur n'a pas pu être trouvé.");
    }
    // Verify the password
    const passwordBody = body.password;
    const passwordAdmin = admin.password.password;
    const validPassword = verifyPassword(passwordAdmin, passwordBody);
    if (!validPassword) {
      throw new UnauthorizedException('Le mot de passe est incorrect.');
    }
    // Validate the email if the admin was not logged in before
    if (!admin.email.verified) {
      admin.email.verified = true;
      await admin.save();
    }
    // Generate a new token
    const token = generateToken(admin.id, AccountType.ADMIN);
    return {
      token: token,
    };
  }

  async sendMagicLink(body: SendMagicLinkRequest): Promise<SuccessMessage> {
    const user: Rescuer = await this.adminModel.findOne({
      'email.email': body.email,
    });
    if (!user) {
      throw new NotFoundException(
        "L'administrateur est introuvable avec cet email",
      );
    }
    const token = generateToken(user._id, AccountType.ADMIN);
    const frontUrl = process.env.FRONTEND_URL;
    const _finalUrl = `${frontUrl}/auth/magiclogin?token=${token}`;
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
