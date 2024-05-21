import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class AccountCallCenterService {
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
      address: {
        city: user.address.city,
        zip: user.address.zip,
        street: user.address.street,
      },
    };
  }
}
