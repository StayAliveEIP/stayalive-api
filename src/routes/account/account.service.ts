import { Injectable } from '@nestjs/common';
import { Rescuer } from '../../schemas/rescuer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async index(): Promise<any> {
    return {};
  }
}
