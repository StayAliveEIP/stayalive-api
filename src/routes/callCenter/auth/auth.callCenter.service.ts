import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../../../database/admin.schema';
import { Model } from 'mongoose';
import {
  LoginAdminRequest,
  LoginAdminResponse,
} from '../../admin/auth/auth.admin.dto';
import { generateToken, verifyPassword } from '../../../utils/crypt.utils';
import { CallCenter } from '../../../database/callCenter.schema';
import {
  LoginCallCenterRequest,
  LoginCallCenterResponse,
} from './auth.callCenter.dto';

@Injectable()
export class AuthCallCenterService {
  constructor(
    @InjectModel(CallCenter.name) private callCenterModel: Model<CallCenter>,
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
    const token = generateToken(admin.id);
    return {
      token: token,
    };
  }
}
