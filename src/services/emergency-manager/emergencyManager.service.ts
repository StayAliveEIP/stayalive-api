import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  EmergencyAskAssignEvent,
  EmergencyCreatedEvent,
  EventType,
} from './emergencyManager.dto';
import { RedisService, RescuerPositionWithId } from '../redis/redis.service';
import {
  GeoCoordinates,
  getDistanceInKilometers,
} from '../../utils/position.utils';
import { Model, Types } from 'mongoose';
import { RescuerWebsocket } from '../../websocket/rescuer/rescuer.websocket';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../database/rescuer.schema';
import { Emergency } from '../../database/emergency.schema';

@Injectable()
export class EmergencyManagerService {
  private readonly logger: Logger = new Logger(EmergencyManagerService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly event: EventEmitter2,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
  ) {}

  /**
   * This route will try to search a valid rescuer for the emergency.
   * @param event The event that contains the emergency id.
   * @private This method is private because it should only be called by the event emitter.
   */
  @OnEvent(EventType.EMERGENCY_CREATED)
  private async onEmergencyCreated(event: EmergencyCreatedEvent) {
    const allPositions: RescuerPositionWithId[] =
      await this.getAllPositions(event);
    if (allPositions.length === 0) {
      this.logger.log(
        'No rescuer available for emergency ' + event.emergencyId + '.',
      );
      return;
    }
    const nearestPosition: RescuerPositionWithId | null =
      await this.getNearestPosition(allPositions);
    if (!nearestPosition) {
      this.logger.warn(
        'No nearest position found for emergency ' + event.emergencyId + '.',
      );
      return;
    }
    this.logger.log(
      'Found nearest position for emergency ' +
        event.emergencyId +
        ' with rescuer ' +
        nearestPosition.id +
        '.',
    );
    // Send event to ask to assign the rescuer to the emergency
    await this.setAssignedRescuer(event.emergencyId, nearestPosition.id);
    await this.sendEventAskAssignRescuer(
      event.emergencyId,
      nearestPosition.id,
      event.info,
      {
        lat: event.lat,
        lng: event.long,
      },
    );
  }

  private async sendEventAskAssignRescuer(
    emergencyId: Types.ObjectId,
    rescuerId: Types.ObjectId,
    info: string = '',
    position: {
      lat: number;
      lng: number;
    } = {
      lat: 0,
      lng: 0,
    },
  ) {
    const event: EmergencyAskAssignEvent = {
      emergencyId: emergencyId,
      rescuerId: rescuerId,
      info: info,
      position: position,
    };
    this.event.emit(EventType.EMERGENCY_ASK_ASSIGN, event);
  }

  private async getAllPositions(
    event: EmergencyCreatedEvent,
  ): Promise<RescuerPositionWithId[]> {
    this.logger.log(
      'New emergency created: ' +
        event.emergencyId +
        ' - ' +
        event.lat +
        ' - ' +
        event.long,
    );
    const rescuerAvailable = await this.redis.getAllRescuerAvailable();
    this.logger.log(
      'Found ' +
        rescuerAvailable.length +
        ' rescuers available for emergency ' +
        event.emergencyId +
        ': ' +
        rescuerAvailable,
    );
    const rescuerWithPosition =
      await this.redis.getAllPosition(rescuerAvailable);
    this.logger.log(
      'Found ' +
        rescuerWithPosition.length +
        ' rescuers with position available for emergency ' +
        event.emergencyId +
        ': ' +
        rescuerWithPosition.map((rescuer) => rescuer.id),
    );
    // Map to get only key in array
    const connected = Array.from(RescuerWebsocket.clients.keys());
    this.logger.log(
      'Found ' +
        connected.length +
        ' connected rescuers for emergency: ' +
        connected,
    );
    // Keep only connected rescuers
    return rescuerWithPosition.filter((rescuer) =>
      connected.map((id) => id.toString()).includes(rescuer.id.toString()),
    );
  }

  private async getNearestPosition(
    allPositions: RescuerPositionWithId[],
  ): Promise<RescuerPositionWithId | null> {
    if (allPositions.length === 0) return null;
    return allPositions.reduce((prev, curr) => {
      getDistanceInKilometers(
        new GeoCoordinates(prev.position.lat, prev.position.lng),
        new GeoCoordinates(curr.position.lat, curr.position.lng),
      );
      const prevDistance: number = getDistanceInKilometers(
        new GeoCoordinates(prev.position.lat, prev.position.lng),
        new GeoCoordinates(curr.position.lat, curr.position.lng),
      );
      const currDistance: number = getDistanceInKilometers(
        new GeoCoordinates(curr.position.lat, curr.position.lng),
        new GeoCoordinates(prev.position.lat, prev.position.lng),
      );
      return prevDistance < currDistance ? prev : curr;
    });
  }

  private async setAssignedRescuer(
    emergencyId: Types.ObjectId,
    rescuerId: Types.ObjectId,
  ) {
    await this.emergencyModel.updateOne(
      { _id: emergencyId },
      { rescuerAssigned: rescuerId },
    );
  }
}
