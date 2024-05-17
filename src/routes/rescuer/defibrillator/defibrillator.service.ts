import { Injectable } from '@nestjs/common';
import {
  DefibrillatorProposalDto,
  DefibrillatorProposalResponse,
} from './defibrillator.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Defibrillator,
  DefibrillatorStatus,
} from '../../../database/defibrillator.schema';
import { AmazonS3Service } from '../../../services/s3/s3.service';
import { GoogleApiService } from '../../../services/google-map/google.service';

@Injectable()
export class DefibrillatorService {
  constructor(
    @InjectModel(Defibrillator.name)
    private defibrillatorModel: Model<Defibrillator>,
    private googleService: GoogleApiService,
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

    const details = await this.googleService.placeIdToLatLongAndAddress(
      body.placeId,
    );

    await this.defibrillatorModel.create({
      proposedBy: id,
      placeId: body.placeId,
      address: details.address,
      location: {
        lat: details.latLong.lat,
        lng: details.latLong.lng,
      },
      name: body.name,
      pictureUrl: url.url,
      status: DefibrillatorStatus.PENDING,
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
    const def = await this.defibrillatorModel.find({
      status: DefibrillatorStatus.VALIDATED,
    });
    return def.map((d) => {
      const { proposedBy, ...rest } = d.toObject();
      return rest;
    });
  }
}
