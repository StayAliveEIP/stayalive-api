import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Emergency, EmergencyStatus } from '../../../database/emergency.schema';
import {
  CreateNewEmergencyRequest,
  EmergencyInfoResponse,
} from './emergency.callCenter.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EmergencyCanceledEvent,
  EmergencyCreatedEvent,
  EventType,
} from '../../../services/emergency-manager/emergencyManager.dto';
import { CallCenter } from '../../../database/callCenter.schema';
import { GoogleApiService } from '../../../services/google-map/google.service';
import { SuccessMessage } from '../../../dto.dto';
import { Rescuer } from '../../../database/rescuer.schema';

@Injectable()
export class EmergencyCallCenterService {
  private readonly logger: Logger = new Logger(EmergencyCallCenterService.name);
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(CallCenter.name) private callCenterModel: Model<CallCenter>,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    private googleService: GoogleApiService,
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
          info: 1,
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

    const details = await this.googleService.placeIdToLatLongAndAddress(
      body.placeId,
    );

    const emergency: Emergency = {
      _id: new Types.ObjectId(),
      callCenterId: userId,
      info: body.info ? body.info : '',
      position: {
        lat: details.latLong.lat,
        long: details.latLong.lng,
      },
      address: details.address,
      placeId: body.placeId,
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
    this.logger.log(`Emergency created: ${result._id}`);
    return {
      id: result._id,
    };
  }

  async closeEmergency(
    userId: Types.ObjectId,
    emergencyId: string,
  ): Promise<SuccessMessage> {
    const emergency = await this.emergencyModel.findOne({
      _id: emergencyId,
      callCenterId: userId,
    });
    if (!emergency) {
      throw new NotFoundException('Emergency not found');
    }
    const callCenter = await this.callCenterModel.findById(userId);
    if (!callCenter) {
      throw new NotFoundException('You are not a call center');
    }
    const rescuer = await this.rescuerModel.findById(emergency.rescuerAssigned);
    if (!rescuer) {
      this.logger.error(
        'Rescuer in emergency not found with id: ' + emergency.rescuerAssigned,
      );
      throw new InternalServerErrorException('Rescuer in emergency not found');
    }

    emergency.status = EmergencyStatus.CANCELED;
    await emergency.save();

    const event: EmergencyCanceledEvent = {
      emergency: emergency,
      callCenter: callCenter,
      rescuer: rescuer,
    };

    this.eventEmitter.emit(EventType.EMERGENCY_CANCELED, event);
    return {
      message: 'Emergency closed',
    };
  }
}
