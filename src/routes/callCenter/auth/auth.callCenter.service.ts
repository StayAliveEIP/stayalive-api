import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateToken, verifyPassword } from '../../../utils/crypt.utils';
import { CallCenter } from '../../../database/callCenter.schema';
import {
  LoginCallCenterRequest,
  LoginCallCenterResponse,
} from './auth.callCenter.dto';
import { AccountType } from '../../../guards/auth.route.guard';
import { SendMagicLinkRequest } from '../../rescuer/auth/auth.dto';
import { SuccessMessage } from '../../../dto.dto';
import { ReactEmailService } from '../../../services/react-email/react-email.service';

@Injectable()
export class AuthCallCenterService {
  constructor(
    @InjectModel(CallCenter.name) private callCenterModel: Model<CallCenter>,
    private readonly reactEmailService: ReactEmailService,
  ) {}

  async login(body: LoginCallCenterRequest): Promise<LoginCallCenterResponse> {
    // Find the admin
    const admin = await this.callCenterModel.findOne({
      'email.email': body.email,
    });
    if (!admin) {
      throw new NotFoundException("Le centre d'appel n'a pas pu être trouvé.");
    }
    // Verify the password
    const passwordBody = body.password;
    const passwordAdmin = admin.password.password;
    console.log(passwordBody, passwordAdmin);
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
    const token = generateToken(admin.id, AccountType.CALL_CENTER);
    return {
      accessToken: token,
    };
  }

  async sendMagicLink(body: SendMagicLinkRequest): Promise<SuccessMessage> {
    const user: CallCenter = await this.callCenterModel.findOne({
      'email.email': body.email,
    });
    if (!user) {
      throw new NotFoundException(
        "Le centre d'appel est introuvable avec cet email",
      );
    }
    const token = generateToken(user._id, AccountType.CALL_CENTER);
    const frontUrl = process.env.FRONTEND_URL;
    console.log(frontUrl);
    const _finalUrl = `${frontUrl}/auth/magiclogin?token=${token}`;
    this.reactEmailService.sendMagicLinkEmail(body.email, user.name, _finalUrl);
    return {
      message: 'Un lien magique vous a été envoyé par email.',
    };
  }
}
