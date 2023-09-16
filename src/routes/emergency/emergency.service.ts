import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Call } from '../../database/call.schema';
import { newEmergencyDto } from './emergency.dto';

@Injectable()
export class EmergencyService {
  constructor(@InjectModel(Call.name) private callModel: Model<Call>) {}
  async createEmergency(emergency: newEmergencyDto) {
    await this.callModel.create(emergency);
    return {
      message: "L'urgence a bien été enregistrée.",
    };
  }

  async modifyEmergency(emergency: newEmergencyDto, id: string) {
    await this.callModel.findByIdAndUpdate(id, emergency);
    return {
      message: "L'urgence a bien été modifiée.",
    };
  }

  async deleteEmergency(id: string) {
    await this.callModel.findByIdAndDelete(id);
    return {
      message: "L'urgence a bien été supprimée.",
    };
  }
}
