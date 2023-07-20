import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../database/rescuer.schema';
import { Model } from 'mongoose';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async setStatus(): Promise<void> {
    return;
  }

  async getStatus(): Promise<void> {
    return;
  }
}
