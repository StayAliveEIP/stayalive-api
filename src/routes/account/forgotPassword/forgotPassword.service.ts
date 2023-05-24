import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { Rescuer } from '../../../schemas/rescuer.schema';
import {
  ForgotPasswordLinkDTO,
  ForgotPasswordLinkResponse,
  ForgotPasswordResetDTO,
  ForgotPasswordResetResponse,
} from './forgotPassword.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async index(
    body: ForgotPasswordLinkDTO,
  ): Promise<ForgotPasswordLinkResponse> {
    return {
      message: 'This route is not implemented yet.',
    };
  }

  async reset(
    body: ForgotPasswordResetDTO,
  ): Promise<ForgotPasswordResetResponse> {
    return {
      message: 'This route is not implemented yet.',
    };
  }
}
