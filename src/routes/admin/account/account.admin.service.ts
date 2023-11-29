import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../../database/admin.schema';
import { SuccessMessage } from '../../../dto.dto';
import { InfoResponse, NewRequest } from './account.admin.dto';

@Injectable()
export class AccountAdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async info(): Promise<InfoResponse> {
    return {
      emailVerified: true,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@doe.com',
    };
  }

  async new(body: NewRequest): Promise<SuccessMessage> {
    return {
      message: 'Account created for ' + body.email + '.',
    };
  }
}
