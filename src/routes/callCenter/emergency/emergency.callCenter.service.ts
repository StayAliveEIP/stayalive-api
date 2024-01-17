import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Emergency, EmergencyStatus } from '../../../database/emergency.schema';
import {
  CreateNewEmergencyRequest,
  EmergencyInfoResponse,
} from './emergency.callCenter.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EmergencyCreatedEvent,
  EventType,
} from '../../../services/emergency-manager/emergencyManager.dto';
import { CallCenter } from '../../../database/callCenter.schema';
import { Rescuer } from '../../../database/rescuer.schema';

@Injectable()
export class EmergencyCallCenterService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(CallCenter.name) private callCenterModel: Model<CallCenter>,
  ) {}

  async getEmergency(
    userId: Types.ObjectId,
  ): Promise<Array<EmergencyInfoResponse>> {
    // Get all emergencies that your previously created
    const pipeline = [
      {
        $match: { callCenterId: userId },
      },
      {
        $lookup: {
          from: 'rescuers', // the collection name of Rescuer in your database
          localField: 'rescuerAssigned',
          foreignField: '_id',
          as: 'rescuerAssignedInfo',
        },
      },
      {
        $unwind: {
          path: '$rescuerAssignedInfo',
          preserveNullAndEmptyArrays: true, // to keep emergencies with null rescuerAssigned
        },
      },
      {
        $project: {
          id: '$_id',
          rescuerAssigned: '$rescuerAssignedInfo',
          status: 1,
          address: 1,
        },
      },
    ];

    const emergencies = await this.emergencyModel.aggregate(pipeline).exec();

    return emergencies.map((emergency) => ({
      id: emergency.id,
      status: emergency.status,
      address: emergency.address,
      rescuerAssigned: emergency.rescuerAssigned
        ? {
            id: emergency.rescuerAssigned._id,
            firstname: emergency.rescuerAssigned.firstname,
            lastname: emergency.rescuerAssigned.lastname,
            phone: emergency.rescuerAssigned.phone.phone,
          }
        : null,
      info: emergency.info ? emergency.info : '',
    }));
  }

  async createEmergency(
    userId: Types.ObjectId,
    body: CreateNewEmergencyRequest,
  ): Promise<any> {
    // Create a new emergency
    const emergency: Emergency = {
      _id: new Types.ObjectId(),
      callCenterId: userId,
      info: body.info ? body.info : '',
      position: {
        lat: 123,
        long: 123,
      },
      address: body.address,
      status: EmergencyStatus.PENDING,
      rescuerAssigned: null,
      rescuerHidden: [],
    };
    const result = await this.emergencyModel.create(emergency);
    const callCenter = await this.callCenterModel.findById(userId);
    // Send the event
    const emergencyCreated: EmergencyCreatedEvent = {
      emergency: result,
      callCenter: callCenter,
    };

    this.eventEmitter.emit(EventType.EMERGENCY_CREATED, emergencyCreated);
    return {
      id: result._id,
    };
  }
}
