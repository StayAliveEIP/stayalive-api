import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../../../database/admin.schema';
import { LoginAdminRequest, LoginAdminResponse } from './auth.admin.dto';

@Injectable()
export class AuthAdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async login(body: LoginAdminRequest): Promise<LoginAdminResponse> {
    return {
      token: 'Bearer token',
    };
  }
}
