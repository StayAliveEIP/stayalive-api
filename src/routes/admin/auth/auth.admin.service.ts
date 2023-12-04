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
import { AccountType } from '../../../guards/auth.guard';

@Injectable()
export class AuthAdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

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
}
