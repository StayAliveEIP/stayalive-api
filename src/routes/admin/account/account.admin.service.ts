import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin } from '../../../database/admin.schema';
import { SuccessMessage } from '../../../dto.dto';
import { InfoResponse, NewRequest } from './account.admin.dto';
import { cryptPassword, randomPassword } from '../../../utils/crypt.utils';

@Injectable()
export class AccountAdminService {
  private readonly logger: Logger = new Logger(AccountAdminService.name);

  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {
    this.createDefaultAdminAccount();
  }

  async info(userId: Types.ObjectId): Promise<InfoResponse> {
    // Find the admin
    const admin = await this.adminModel.findById(userId);
    if (!admin) {
      throw new NotFoundException("L'administrateur n'a pas pu être trouvé.");
    }
    return {
      email: admin.email.email,
      emailVerified: admin.email.verified,
      firstname: admin.firstname,
      lastname: admin.lastname,
    };
  }

  async new(body: NewRequest): Promise<SuccessMessage> {
    // Verify if an admin with this email already exists
    const emailExists = await this.adminModel.findOne({
      'email.email': body.email,
    });
    if (emailExists) {
      throw new ConflictException(
        'Un administrateur avec cette adresse email existe déjà.',
      );
    }
    const password = randomPassword();
    const passwordHashed = cryptPassword(password);
    const newAdmin = new this.adminModel({
      email: {
        email: body.email,
        verified: false,
      },
      firstname: body.firstname,
      lastname: body.lastname,
      password: passwordHashed,
    });
    const result = await newAdmin.save();
    if (!result) {
      throw new InternalServerErrorException(
        "L'administrateur n'a pas pu être créé.",
      );
    }
    // TODO: Send an email with the password
    return {
      message: 'Account created for ' + body.email + '.',
    };
  }

  /**
   * Create the default admin account if it doesn't exist,
   * this function is called when the application starts.
   */
  async createDefaultAdminAccount(): Promise<void> {
    // Create the default admin account if it doesn't exist
    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL;
    // Check if the email already exists
    const emailExists = await this.adminModel.findOne({
      'email.email': defaultEmail,
    });
    if (emailExists) {
      this.logger.log(
        'The default admin account already exists, it will not be created.',
      );
      return;
    }
    // Create the default admin account
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
    const passwordHashed = cryptPassword(defaultPassword);
    const adminObj: Admin = {
      _id: new Types.ObjectId(),
      email: {
        email: defaultEmail,
        verified: false,
        lastCodeSent: null,
        code: null,
      },
      firstname: 'Admin',
      lastname: 'Admin',
      password: {
        password: passwordHashed,
        lastChange: null,
        lastTokenSent: null,
        token: null,
      },
    };
    const newAdmin = new this.adminModel(adminObj);
    const result = await newAdmin.save();
    if (!result) {
      this.logger.error(
        "The default admin account couldn't be created, please check the environment variables.",
      );
      return;
    }
    this.logger.log(
      'The default admin account was created, please check the environment variables.',
    );
  }
}
