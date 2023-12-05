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
import { Types } from 'mongoose';

@Injectable()
export class EmergencyManagerService {
  private readonly logger: Logger = new Logger(EmergencyManagerService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly event: EventEmitter2,
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
    const nearestPosition: RescuerPositionWithId | null =
      await this.getNearestPosition(allPositions);
    if (!nearestPosition) {
      this.logger.log(
        'No rescuer available for emergency ' + event.emergencyId + '.',
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
    await this.sendEventAskAssignRescuer(event.emergencyId, nearestPosition.id);
  }

  private async sendEventAskAssignRescuer(
    emergencyId: Types.ObjectId,
    rescuerId: Types.ObjectId,
  ) {
    const event: EmergencyAskAssignEvent = {
      emergencyId: emergencyId,
      rescuerId: rescuerId,
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
        '.',
    );
    const rescuerWithPosition =
      await this.redis.getAllPosition(rescuerAvailable);
    this.logger.log(
      'Found ' +
        rescuerWithPosition.length +
        ' rescuers with position available for emergency ' +
        event.emergencyId +
        '.',
    );
    return rescuerWithPosition;
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
}
