import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Emergency, EmergencyStatus } from '../../../database/emergency.schema';
import {
  CreateNewEmergencyRequest,
  EmergencyInfoResponse,
} from './emergency.callCenter.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmergencyCreatedEvent, EventType } from '../../../event/event.dto';

@Injectable()
export class EmergencyCallCenterService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
  ) {}

  async getEmergency(
    userId: Types.ObjectId,
  ): Promise<Array<EmergencyInfoResponse>> {
    // Get all emergencies that your previously created
    const emergencies = await this.emergencyModel.find({
      callCenterId: userId,
    });
    const emergenciesInfo: Array<EmergencyInfoResponse> = [];
    emergencies.forEach((emergency) => {
      emergenciesInfo.push({
        id: emergency._id,
      });
    });
    return emergenciesInfo;
  }

  async createEmergency(
    userId: Types.ObjectId,
    body: CreateNewEmergencyRequest,
  ): Promise<EmergencyInfoResponse> {
    // Create a new emergency
    const emergency: Emergency = {
      _id: new Types.ObjectId(),
      callCenterId: userId,
      info: body.info,
      position: {
        lat: body.position.lat,
        long: body.position.long,
      },
      status: EmergencyStatus.PENDING,
      rescuerAssigned: null,
    };
    const result = await this.emergencyModel.create(emergency);
    // Send the event
    const emergencyCreated: EmergencyCreatedEvent = {
      emergencyId: emergency._id,
      lat: body.position.lat,
      long: body.position.long,
    };
    this.eventEmitter.emit(EventType.EMERGENCY_CREATED, emergencyCreated);
    return {
      id: result._id,
    };
  }
}
