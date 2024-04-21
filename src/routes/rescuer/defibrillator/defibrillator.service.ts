import { Injectable } from '@nestjs/common';
import {
  DefibrillatorProposalDto,
  DefibrillatorProposalResponse,
} from './defibrillator.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Defibrillator } from '../../../database/defibrillator.schema';
import { AmazonS3Service } from '../../../services/s3/s3.service';

@Injectable()
export class DefibrillatorService {
  constructor(
    @InjectModel(Defibrillator.name)
    private defibrillatorModel: Model<Defibrillator>,
  ) {}
  async propose(
    body: DefibrillatorProposalDto,
    id: Types.ObjectId,
  ): Promise<DefibrillatorProposalResponse> {
    const s3 = AmazonS3Service.getInstance();
    const randomkey = Math.random().toString(36).substring(7);
    const key = `defibrillator/${randomkey}`;
    const contentType = body.imageSrc.split(';')[0].split(':')[1];
    const url = await s3.uploadFile(key, body.imageSrc, contentType);
    await this.defibrillatorModel.create({
      proposedBy: id,
      ...body,
      pictureUrl: url.url,
    });
    return {
      message: 'Votre proposition a bien été enregistrée.',
    };
  }

  async getUserDefibrillators(userId: Types.ObjectId) {
    const def = await this.defibrillatorModel.find({ proposedBy: userId });
    return def.map((d) => {
      const { proposedBy, ...rest } = d.toObject();
      return rest;
    });
  }

  async getDefibrillators() {
    const def = await this.defibrillatorModel.find({ status: 'validated' });
    return def.map((d) => {
      const { proposedBy, ...rest } = d.toObject();
      return rest;
    });
  }
}
