import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Admin } from '../../../database/admin.schema';
import { SuccessMessage } from '../../../dto.dto';
import {
  ChangeEmailRequest,
  ChangePasswordRequest,
  DeleteAdminRequest,
  DeleteMyAccountRequest,
  InfoResponse,
  NewRequest,
  UpdateAdminAccountRequest,
  VerifyEmailRequest,
} from './account.admin.dto';
import {
  hashPassword,
  randomPassword,
  verifyPassword,
} from '../../../utils/crypt.utils';
import { ReactEmailService } from '../../../services/react-email/react-email.service';

@Injectable()
export class AccountAdminService {
  private readonly logger: Logger = new Logger(AccountAdminService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private readonly reactEmailService: ReactEmailService,
  ) {
    this.createDefaultAdminAccount();
  }

  async info(userId: Types.ObjectId): Promise<InfoResponse> {
    // Find the admin
    const admin = await this.adminModel.findOne({ _id: userId });
    if (!admin) {
      throw new NotFoundException("L'administrateur n'a pas pu être trouvé.");
    }
    return {
      id: admin.id,
      email: admin.email.email,
      emailVerified: admin.email.verified,
      firstname: admin.firstname,
      lastname: admin.lastname,
    };
  }

  async all(): Promise<Array<InfoResponse>> {
    // Find all the admins
    const admins = await this.adminModel.find();
    if (!admins) {
      throw new NotFoundException("L'administrateur n'a pas pu être trouvé.");
    }
    return admins.map((admin) => ({
      id: admin.id,
      email: admin.email.email,
      emailVerified: admin.email.verified,
      firstname: admin.firstname,
      lastname: admin.lastname,
    }));
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
    const passwordHashed = hashPassword(password);

    const newAdminObj: Admin = {
      _id: new Types.ObjectId(),
      email: {
        email: body.email,
        verified: false,
        lastCodeSent: null,
        code: null,
      },
      firstname: body.firstname,
      lastname: body.lastname,
      password: {
        password: passwordHashed,
        lastChange: null,
        lastTokenSent: null,
        token: null,
      },
    };

    const newAdmin = new this.adminModel(newAdminObj);
    const result = await newAdmin.save();
    if (!result) {
      throw new InternalServerErrorException(
        "L'administrateur n'a pas pu être créé.",
      );
    }
    this.reactEmailService.sendMailCreatedAccountPassword(
      body.email,
      body.firstname,
      password,
    );
    return {
      message: 'Account created for ' + body.email + '.',
    };
  }

  async delete(body: DeleteAdminRequest): Promise<SuccessMessage> {
    const idToDelete = body.id;
    const objectId = Types.ObjectId.isValid(idToDelete);
    if (!objectId) {
      throw new UnprocessableEntityException(
        "Le format de l'id n'est pas valide.",
      );
    }
    // Find the admin
    const admin = await this.adminModel.findById(idToDelete);
    if (!admin) {
      throw new NotFoundException("L'administrateur n'a pas pu être trouvé.");
    }
    // Delete the admin
    const result = await this.adminModel.deleteOne({ _id: admin.id });
    if (!result || result.deletedCount === 0) {
      throw new InternalServerErrorException(
        "L'administrateur n'a pas pu être supprimé.",
      );
    }
    return {
      message: 'Le compte administrateur a été supprimé.',
    };
  }

  async deleteMyAccount(
    userId: Types.ObjectId,
    body: DeleteMyAccountRequest,
  ): Promise<SuccessMessage> {
    // Find the admin
    const admin = await this.adminModel.findById(userId);
    if (!admin) {
      throw new NotFoundException("L'administrateur n'a pas pu être trouvé.");
    }
    // Compare the password in the body
    const plainPassword = body.password;
    const passwordAdmin = admin.password.password;
    const validPassword = verifyPassword(passwordAdmin, plainPassword);
    if (!validPassword) {
      throw new ForbiddenException('Le mot de passe est incorrect.');
    }
    // Delete the admin
    const result = await this.adminModel.deleteOne({ _id: userId });
    if (!result || result.deletedCount === 0) {
      throw new InternalServerErrorException(
        "L'administrateur n'a pas pu être supprimé.",
      );
    }
    return {
      message: 'Votre compte a été supprimé.',
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
    const passwordHashed = hashPassword(defaultPassword);
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

  async changePassword(
    userId: Types.ObjectId,
    body: ChangePasswordRequest,
  ): Promise<SuccessMessage> {
    // Find the admin
    const admin = await this.adminModel.findById(userId);
    if (!admin) {
      throw new NotFoundException("L'administrateur n'a pas pu être trouvé.");
    }
    // Verify the password
    const validPassword = verifyPassword(
      admin.password.password,
      body.oldPassword,
    );
    if (!validPassword) {
      throw new ForbiddenException(
        'Mot de passe actuel incorrect, impossible de changer le mot de passe.',
      );
    }
    // Change the password
    admin.password.password = hashPassword(body.newPassword);
    await admin.save();
    return {
      message: 'Votre mot de passe a bien été changé.',
    };
  }

  async changeEmail(
    userId: Types.ObjectId,
    body: ChangeEmailRequest,
  ): Promise<SuccessMessage> {
    // Find the user in database
    const user = await this.adminModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    // verify that new email is not already used
    const emailAlreadyUsed = await this.adminModel.findOne({
      'email.email': body.email,
    });
    if (emailAlreadyUsed) {
      throw new ForbiddenException(
        'Cette adresse email est déjà utilisée par un autre utilisateur ou par vous même.',
      );
    }
    const token: string =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Change the email
    user.email.email = body.email;
    user.email.verified = false;
    user.email.code = token;
    user.email.lastCodeSent = new Date();
    await user.save();
    // Send the email
    this.reactEmailService.sendMailVerifyEmailCode(
      body.email,
      user.firstname,
      token,
    );
    return {
      message:
        'Votre adresse email a bien été changée, un email de vérification vous a été envoyé.',
    };
  }

  async verifyEmail(
    userId: Types.ObjectId,
    body: VerifyEmailRequest,
  ): Promise<SuccessMessage> {
    // Find the user in database
    const user = await this.adminModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const validToken = body.code === user.email.code;
    if (!validToken) {
      throw new ForbiddenException('Le code de vérification est incorrect.');
    }
    // Verify the email in database
    user.email.verified = true;
    await user.save();
    return {
      message: 'Votre adresse email a bien été vérifiée.',
    };
  }

  async update(body: UpdateAdminAccountRequest): Promise<SuccessMessage> {
    const id = body.id;
    const admin = await this.adminModel.findById(id);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    admin.firstname = body.firstname;
    admin.lastname = body.lastname;
    await admin.save();
    return {
      message: 'The admin account was updated.',
    };
  }
}
