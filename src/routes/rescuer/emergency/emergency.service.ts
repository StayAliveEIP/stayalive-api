import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Emergency, EmergencyStatus } from '../../../database/emergency.schema';
import { SuccessMessage } from '../../../dto.dto';
import {
  EmergencyAssignedEvent,
  EmergencyCreatedEvent,
  EmergencyRefusedEvent,
  EmergencyTerminatedEvent,
  EventType,
} from '../../../services/emergency-manager/emergencyManager.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { reportUnhandledError } from 'rxjs/internal/util/reportUnhandledError';
import { CallCenter } from '../../../database/callCenter.schema';

@Injectable()
export class EmergencyService {
  constructor(
    private eventEmitter: EventEmitter2,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(CallCenter.name) private callCenterModel: Model<CallCenter>,
  ) {}

  async acceptEmergency(
    userId: Types.ObjectId,
    id: string,
  ): Promise<SuccessMessage> {
    // Get the emergency from the database
    const emergency = await this.emergencyModel.findById(
      new Types.ObjectId(id),
    );
    if (!emergency) {
      throw new NotFoundException("L'urgence n'existe pas.");
    }
    // Verify the state of the emergency
    if (emergency.status === EmergencyStatus.ASSIGNED) {
      throw new BadRequestException("L'urgence a déjà été assignée.");
    }
    if (emergency.status === EmergencyStatus.RESOLVED) {
      throw new BadRequestException("L'urgence a déjà été résolue.");
    }
    // Assign the emergency to the rescuer
    emergency.rescuerAssigned = userId;
    emergency.status = EmergencyStatus.ASSIGNED;
    await emergency.save();
    // Send the event
    const callCenter = await this.callCenterModel.findById(
      emergency.callCenterId,
    );
    if (!callCenter) {
      throw new Error('Call center not found');
    }
    const rescuer = await this.rescuerModel.findById(userId);
    if (!rescuer) {
      throw new Error('Rescuer not found');
    }

    const emergencyAccepted: EmergencyAssignedEvent = {
      emergency: emergency,
      callCenter: callCenter,
      rescuer: rescuer,
    };
    this.eventEmitter.emit(EventType.EMERGENCY_ASSIGNED, emergencyAccepted);
    return {
      message: "Vous avez bien accepté l'urgence.",
    };
  }

  async terminateEmergency(userId: Types.ObjectId, id: string) {
    // Get the emergency from the database
    const emergency = await this.emergencyModel.findById(
      new Types.ObjectId(id),
    );
    const callCenter = await this.callCenterModel.findById(
      emergency.callCenterId,
    );
    if (!callCenter) {
      throw new Error('Call center not found');
    }
    const rescuer = await this.rescuerModel.findById(userId);
    if (!rescuer) {
      throw new Error('Rescuer not found');
    }
    if (!emergency) {
      throw new NotFoundException("L'urgence n'existe pas.");
    }
    // Verify the state of the emergency
    if (emergency.status === EmergencyStatus.PENDING) {
      throw new BadRequestException("L'urgence n'a pas encore été assignée.");
    }
    if (emergency.status === EmergencyStatus.RESOLVED) {
      throw new BadRequestException("L'urgence a déjà été résolue.");
    }
    // Verify that the rescuer is the one assigned to the emergency
    if (!emergency.rescuerAssigned.equals(userId)) {
      throw new BadRequestException("Vous n'êtes pas assigné à cette urgence.");
    }
    // Send event
    const event: EmergencyTerminatedEvent = {
      emergency: emergency,
      callCenter: callCenter,
      rescuer: rescuer,
    };
    this.eventEmitter.emit(EventType.EMERGENCY_TERMINATED, event);
    // Terminate the emergency
    emergency.status = EmergencyStatus.RESOLVED;
    await emergency.save();
    return {
      message: "L'urgence a bien été terminée.",
    };
  }

  //TODO : Redis
  async refuseEmergency(userId: Types.ObjectId, id: string) {
    const emergency = await this.emergencyModel.findById(
      new Types.ObjectId(id),
    );
    if (!emergency) {
      throw new NotFoundException("L'urgence n'existe pas.");
    }
    if (emergency.status === EmergencyStatus.RESOLVED) {
      throw new BadRequestException("L'urgence a déjà été résolue.");
    }
    try {
      emergency.rescuerHidden.push(new Types.ObjectId(userId));
      await this.emergencyModel.findByIdAndUpdate(
        new Types.ObjectId(id),
        emergency,
      );
    } catch (error) {
      console.error('Error during emergency save operation:', error);
      throw error;
    }

    const eventCreatedTemplate: EmergencyCreatedEvent = {
      emergency: emergency,
      callCenter: await this.callCenterModel.findById(emergency.callCenterId),
    };
    this.eventEmitter.emit(EventType.EMERGENCY_CREATED, eventCreatedTemplate);
    return {
      message: "Vous avez bien refusé l'urgence",
    };
  }

  async getEmergencyHistory(userId: Types.ObjectId) {
    const rescuer = await this.rescuerModel.findById(userId);
    if (!rescuer) {
      throw new NotFoundException('Rescuer not found');
    }
    const emergencies = await this.emergencyModel
      .find({
        rescuerAssigned: userId,
      })
      .exec();
    return emergencies.map((emergency) => ({
      id: emergency._id,
      status: emergency.status,
      address: emergency.address,
      info: emergency.info ? emergency.info : '',
    }));
  }

  /*
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
   */
}
