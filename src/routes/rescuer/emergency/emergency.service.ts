import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Call } from '../../../database/call.schema';
import { modifyEmergencyDto, newEmergencyDto } from './emergency.dto';
import { Rescuer } from '../../../database/rescuer.schema';

@Injectable()
export class EmergencyService {
  constructor(
    @InjectModel(Call.name) private callModel: Model<Call>,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}
  async createEmergency(emergency: newEmergencyDto) {
    const newEmergency: Call = {
      from: emergency.from,
      at: emergency.at,
      for: emergency.for,
      date: new Date(),
      description: emergency.description,
      status: 'PENDING',
    };
    await this.callModel.create(newEmergency);
    return {
      message: "L'urgence a bien été enregistrée.",
    };
  }

  async modifyEmergency(emergency: modifyEmergencyDto, id: string) {
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

  async getAllEmergencyOfRescuer(id: string) {
    const rescuer = await this.rescuerModel.findById(id);
    // if (!rescuer) {
    //   throw new HttpException('Rescuer not found', 404);
    // }
    const calls = await this.callModel.find({ for: id });
    if (calls.length === 0) {
      throw new HttpException('No emergency found', 404);
    }
    return calls;
  }

  async getActualEmergencyOfRescuer(id: string) {
    const rescuer = await this.rescuerModel.findById(id);
    // if (!rescuer) {
    //   throw new HttpException('Rescuer not found', 404);
    // }
    const currents = await this.callModel.find({ for: id, status: 'CURRENT' });
    if (currents.length === 0) {
      throw new HttpException('No current emergency', 404);
    }
  }

  async cancelEmergencyofRescuer(id: string, rescuer: string) {
    const rescuerModel = await this.rescuerModel.findById(rescuer);
    // if (!rescuer) {
    //   throw new HttpException('Rescuer not found', 404);
    // }
    const calls = await this.callModel.find({ _id: id, status: 'CURRENT' });
    if (calls.length === 0) {
      throw new HttpException('No current emergency', 404);
    }
    const call = calls[0];
    call.status = 'CANCELLED';
    await call.save();
    return {
      message: "L'urgence a bien été annulée.",
    };
  }

  async assignEmergency(id: string, rescuer: string) {
    const rescuerModel = await this.rescuerModel.findById(rescuer);
    // if (!rescuerModel) {
    //   throw new HttpException('Rescuer not found', 404);
    // }
    const calls = await this.callModel.find({ _id: id, status: 'PENDING' });
    if (calls.length === 0) {
      throw new HttpException('No current emergency', 404);
    }
    const call = calls[0];
    call.status = 'CURRENT';
    await call.save();
    return {
      message: "L'urgence a bien été assignée.",
    };
  }
}
