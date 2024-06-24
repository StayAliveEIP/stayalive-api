import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CallCenter } from '../../../database/callCenter.schema';
import { Model, Types } from 'mongoose';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import {
  AccountInformationResponse,
  UpdateAddressRequest,
  UpdateNameRequest,
} from './account.callCenter.dto';
import { SuccessMessage } from '../../../dto.dto';
import { AmazonS3Service } from '../../../services/s3/s3.service';

@Injectable()
export class AccountCallCenterService {
  private readonly logger = new Logger(AccountCallCenterService.name);

  constructor(
    @InjectModel(CallCenter.name) private callCenterModel: Model<CallCenter>,
    private readonly reactEmailService: ReactEmailService,
  ) {}

  async updateName(
    userId: Types.ObjectId,
    body: UpdateNameRequest,
  ): Promise<SuccessMessage> {
    const user = await this.callCenterModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found with your token');
    }
    user.name = body.name;
    await user.save();
    return { message: 'The call center name was updated.' };
  }

  async updateAddress(
    userId: Types.ObjectId,
    body: UpdateAddressRequest,
  ): Promise<SuccessMessage> {
    const user = await this.callCenterModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found with your token');
    }
    user.address.city = body.city;
    user.address.zip = body.zip;
    user.address.street = body.street;
    return {
      message: 'The call center address was updated.',
    };
  }

  async info(userId: Types.ObjectId): Promise<AccountInformationResponse> {
    const user = await this.callCenterModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found with your token');
    }
    return {
      name: user.name,
      phone: user.phone,
      email: {
        email: user.email.email,
        verified: user.email.verified,
      },
      profilePictureUrl: user.profilePictureUrl,
      address: {
        city: user.address.city,
        zip: user.address.zip,
        street: user.address.street,
      },
    };
  }

  async uploadProfilePicture(
    userId: Types.ObjectId,
    files: Array<Express.Multer.File>,
  ): Promise<SuccessMessage> {
    const file: Express.Multer.File = files[0];
    const user = await this.callCenterModel.findById(
      new Types.ObjectId(userId),
    );
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const s3 = AmazonS3Service.getInstance();
    const contentType: string = file.mimetype;
    const key: string = `profile-picture/call-center/${userId.toString()}`;
    const response = await s3.uploadFile(key, file.buffer, contentType);

    this.logger.log('Uploaded profile picture file to S3: ' + response.url);
    user.profilePictureUrl = response.url;
    await user.save();

    return {
      message: 'Votre photo de profil a bien été mise à jour.',
    };
  }

  async deleteProfilePicture(userId: Types.ObjectId): Promise<SuccessMessage> {
    const user = await this.callCenterModel.findById(
      new Types.ObjectId(userId),
    );
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    const s3 = AmazonS3Service.getInstance();
    const key: string = `profile-picture/call-center/${userId.toString()}`;
    await s3.deleteFile(key);

    this.logger.log('Deleted profile picture file from S3: ' + key);
    user.profilePictureUrl = null;
    await user.save();
    return {
      message: 'Votre photo de profil a bien été supprimée.',
    };
  }
}
