import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  AccountIndexResponse,
  ChangeEmailRequest,
  ChangePasswordRequest,
  ChangePhoneRequest,
  DeleteRescuerAccountRequest,
  VerifyEmailRequest,
} from './account.dto';
import { Rescuer } from '../../../database/rescuer.schema';
import { SuccessMessage } from '../../../dto.dto';
import { hashPassword, verifyPassword } from '../../../utils/crypt.utils';
import { Document, DocumentStatus } from '../../../database/document.schema';
import { RedisService } from '../../../services/redis/redis.service';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { AmazonS3Service } from '../../../services/s3/s3.service';

@Injectable()
export class AccountService {
  private readonly logger: Logger = new Logger(AccountService.name);

  constructor(
    private redisService: RedisService,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
    private reactEmailService: ReactEmailService,
  ) {}

  async index(req: Request): Promise<AccountIndexResponse> {
    const userId: string = req['user'].userId;
    const user: Rescuer = await this.rescuerModel.findById(
      new Types.ObjectId(userId),
    );
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    // Verify if all document is validated for rescuer
    let documentsValidated = true;

    for (const docType of Object.values(DocumentStatus)) {
      const docInDB: Document | undefined = await this.documentModel.findOne({
        user: userId,
        type: docType,
        status: DocumentStatus.VALID,
      });
      if (!docInDB) {
        documentsValidated = false;
        break;
      }
    }

    return {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      profilePictureUrl: user.profilePictureUrl,
      email: {
        email: user.email.email,
        verified: user.email.verified,
      },
      phone: {
        phone: user.phone.phone,
        verified: user.phone.verified,
      },
      documentsValidated: documentsValidated,
    };
  }

  async changePassword(
    userId: Types.ObjectId,
    body: ChangePasswordRequest,
  ): Promise<SuccessMessage> {
    // Get the user from database
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    // Verify the password
    const validPassword = verifyPassword(
      user.password.password,
      body.oldPassword,
    );
    if (!validPassword) {
      throw new ForbiddenException(
        'Mot de passe actuel incorrect, impossible de changer le mot de passe.',
      );
    }
    // Change the password
    user.password.password = hashPassword(body.newPassword);
    await user.save();
    return {
      message: 'Votre mot de passe a bien été changé.',
    };
  }

  async deleteAccount(
    userId: Types.ObjectId,
    body: DeleteRescuerAccountRequest,
  ): Promise<SuccessMessage> {
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const validPassword = verifyPassword(user.password.password, body.password);
    if (!validPassword) {
      throw new ForbiddenException(
        'Mot de passe incorrect, impossible de supprimer le compte.',
      );
    }
    const deleteResult = await this.rescuerModel.deleteOne({
      _id: new Types.ObjectId(userId),
    });
    if (deleteResult.deletedCount !== 1) {
      throw new InternalServerErrorException(
        'Une erreur est survenue lors de la suppression du compte.',
      );
    }
    // delete all information in database
    await this.documentModel.deleteMany({
      user: new Types.ObjectId(userId),
    });
    // delete the status in redis
    await this.redisService.deleteStatusOfRescuer(new Types.ObjectId(userId));
    await this.redisService.deletePositionOfRescuer(new Types.ObjectId(userId));
    return {
      message: 'Votre compte a bien été supprimé.',
    };
  }

  async changeEmail(
    userId: Types.ObjectId,
    body: ChangeEmailRequest,
  ): Promise<SuccessMessage> {
    // Find the user in database
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    // verify that new email is not already used
    const emailAlreadyUsed = await this.rescuerModel.findOne({
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

  async verifyPhone(
    userId: Types.ObjectId,
    body: VerifyEmailRequest,
  ): Promise<SuccessMessage> {
    // Find the user in database
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const validToken = body.code === user.phone.code;
    if (!validToken) {
      throw new ForbiddenException('Le code de vérification est incorrect.');
    }
    // Verify the phone in database
    user.phone.verified = true;
    await user.save();
    return {
      message: 'Votre numéro de téléphone a bien été vérifié.',
    };
  }

  async verifyEmail(
    userId: Types.ObjectId,
    body: VerifyEmailRequest,
  ): Promise<SuccessMessage> {
    // Find the user in database
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
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

  async changePhone(
    userId: Types.ObjectId,
    body: ChangePhoneRequest,
  ): Promise<SuccessMessage> {
    // Find the user in database
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    // verify that new phone is not already used
    const phoneAlreadyUsed = await this.rescuerModel.findOne({
      'phone.phone': body.phone,
    });
    if (phoneAlreadyUsed) {
      throw new ForbiddenException(
        'Ce numéro de téléphone est déjà utilisé par un autre utilisateur ou par vous même.',
      );
    }
    // Change the phone
    user.phone.phone = body.phone;
    user.phone.verified = false;
    await user.save();
    // TODO: Send SMS to verify the new phone
    return {
      message:
        'Votre numéro de téléphone a bien été changé, un SMS de vérification vous a été envoyé.',
    };
  }

  async uploadProfilePicture(
    userId: Types.ObjectId,
    files: Array<Express.Multer.File>,
  ): Promise<SuccessMessage> {
    const file: Express.Multer.File = files[0];
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const s3 = AmazonS3Service.getInstance();
    const contentType: string = file.mimetype;
    const key: string = `profile-picture/${userId.toString()}`;
    const response = await s3.uploadFile(key, file.buffer, contentType);

    this.logger.log('Uploaded profile picture file to S3: ' + response.url);
    user.profilePictureUrl = response.url;
    await user.save();

    return {
      message: 'Votre photo de profil a bien été mise à jour.',
    };
  }

  async deleteProfilePicture(userId: Types.ObjectId): Promise<SuccessMessage> {
    const user = await this.rescuerModel.findById(new Types.ObjectId(userId));
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const s3 = AmazonS3Service.getInstance();
    const key: string = `profile-picture/${userId.toString()}`;
    await s3.deleteFile(key);

    this.logger.log('Deleted profile picture file from S3: ' + key);
    user.profilePictureUrl = null;
    await user.save();
    return {
      message: 'Votre photo de profil a bien été supprimée.',
    };
  }
}
