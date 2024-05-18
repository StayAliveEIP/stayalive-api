import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Defibrillator,
  DefibrillatorStatus,
} from '../../../database/defibrillator.schema';
import { Model, Types } from 'mongoose';
import { DefibrillatorResponse } from './defibrillator.admin.dto';
import { SuccessMessage } from '../../../dto.dto';

@Injectable()
export class DefibrillatorAdminService {
  constructor(
    @InjectModel(Defibrillator.name)
    private defibrillatorModel: Model<Defibrillator>,
  ) {}

  async getAll(): Promise<Array<DefibrillatorResponse>> {
    const data = await this.defibrillatorModel.find();
    return data.map((d) => ({
      _id: d._id.toString(),
      name: d.name,
      address: d.address,
      pictureUrl: d.pictureUrl,
      status: d.status,
    }));
  }

  async getByStatus(
    status: DefibrillatorStatus,
  ): Promise<Array<DefibrillatorResponse>> {
    const data = await this.defibrillatorModel.find({
      status: status,
    });
    return data.map((d) => ({
      _id: d._id.toString(),
      name: d.name,
      address: d.address,
      pictureUrl: d.pictureUrl,
      status: d.status,
    }));
  }

  async getById(id: string): Promise<DefibrillatorResponse> {
    if (Types.ObjectId.isValid(id) === false) {
      throw new BadRequestException('Invalid id format');
    }
    const data = await this.defibrillatorModel.findById(id);
    if (!data) {
      throw new NotFoundException('Defibrillator not found');
    }
    return {
      _id: data._id.toString(),
      name: data.name,
      address: data.address,
      pictureUrl: data.pictureUrl,
      status: data.status,
    };
  }

  async updateStatus(
    id: string,
    status: DefibrillatorStatus,
  ): Promise<SuccessMessage> {
    if (Types.ObjectId.isValid(id) === false) {
      throw new BadRequestException('Invalid id format');
    }
    const result = await this.defibrillatorModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { status: status },
    );
    if (result.matchedCount === 0) {
      throw new NotFoundException('Defibrillator not found');
    }
    return {
      message: 'The defibrillator status has been updated',
    };
  }
}
