import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  EmergencyAskAssignEvent,
  EmergencyCreatedEvent,
  EmergencyTimeoutEvent,
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
import { Emergency } from '../../database/emergency.schema';
import { Rescuer } from '../../database/rescuer.schema';
import { CallCenter } from '../../database/callCenter.schema';

@Injectable()
export class EmergencyManagerService {
  private readonly logger: Logger = new Logger(EmergencyManagerService.name);

  constructor(
    private readonly redis: RedisService,
    private readonly event: EventEmitter2,
    private readonly websocketRescuer: RescuerWebsocket,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  /**
   * This route will try to search a valid rescuer for the emergency.
   * @param event The event that contains the emergency id.
   * @private This method is private because it should only be called by the event emitter.
   */
  @OnEvent(EventType.EMERGENCY_CREATED)
  public async onEmergencyCreated(event: EmergencyCreatedEvent) {
    const emergencyId = event.emergency._id;
    const allPositions: RescuerPositionWithId[] =
      await this.getAllPositions(event);
    if (allPositions.length === 0) {
      this.logger.log(
        'No rescuer available for emergency ' + emergencyId + '.',
      );
      return;
    }
    const nearestPosition: RescuerPositionWithId | null =
      await this.getNearestPosition(allPositions);
    if (!nearestPosition) {
      this.logger.warn(
        'No nearest position found for emergency ' + emergencyId + '.',
      );
      return;
    }
    this.logger.log(
      'Found nearest position for emergency ' +
        emergencyId +
        ' with rescuer ' +
        nearestPosition.id +
        '.',
    );
    // Get the rescuer in database
    const rescuer = await this.rescuerModel.findById(nearestPosition.id);
    if (!rescuer) {
      // TODO: Add to exception manager and search for another rescuer
      this.logger.error("Rescuer to assign doesn't exist in database");
      return;
    }
    // Send event to ask to assign the rescuer to the emergency
    await this.runTimer(event, rescuer);
    await this.sendEventAskAssignRescuer(
      rescuer,
      event.emergency,
      event.callCenter,
    );
  }

  private async sendEventAskAssignRescuer(
    rescuer: Rescuer,
    emergency: Emergency,
    callCenter: CallCenter,
  ) {
    const event: EmergencyAskAssignEvent = {
      rescuer: rescuer,
      emergency: emergency,
      callCenter: callCenter,
    };
    this.event.emit(EventType.EMERGENCY_ASK_ASSIGN, event);
  }

  private async getAllPositions(
    event: EmergencyCreatedEvent,
  ): Promise<RescuerPositionWithId[]> {
    this.logger.log(
      'New emergency created: ' +
        event.emergency._id +
        ' - ' +
        event.emergency.position.lat +
        ' - ' +
        event.emergency.position.long,
    );
    const rescuerAvailable = await this.redis.getAllRescuerAvailable();
    this.logger.log(
      'Found ' +
        rescuerAvailable.length +
        ' rescuers available for emergency ' +
        event.emergency._id +
        ': ' +
        rescuerAvailable,
    );
    const rescuerWithPosition =
      await this.redis.getAllPosition(rescuerAvailable);
    this.logger.log(
      'Found ' +
        rescuerWithPosition.length +
        ' rescuers with position available for emergency ' +
        event.emergency._id +
        ': ' +
        rescuerWithPosition.map((rescuer) => rescuer.id),
    );
    // Map to get only key in array
    const connected = Array.from(this.websocketRescuer.clients.keys());
    this.logger.log(
      'Found ' +
        connected.length +
        ' connected rescuers for emergency: ' +
        connected,
    );
    // Keep only connected rescuers
    const connectedRescuer = rescuerWithPosition.filter((rescuer) =>
      connected.map((id) => id.toString()).includes(rescuer.id.toString()),
    );

    //TODO : switch to redis

    // Keep only rescuers that are not hidden
    const emergency = await this.emergencyModel.findById(event.emergency._id);
    if (!emergency) {
      throw new Error('Emergency not found');
    }
    // Keep only rescuers that are not hidden (the hidden rescuers are the ones that refused the emergency and the array of hidden rescuers is stored in the emergency and called rescuerHidden)
    const rescuerNotHidden = connectedRescuer.filter(
      (rescuer) =>
        !emergency.rescuerHidden
          .map((id) => id.toString())
          .includes(rescuer.id.toString()),
    );
    this.logger.log(
      'Found ' +
        rescuerNotHidden.length +
        ' connected rescuers not hidden for emergency: ' +
        rescuerNotHidden.map((rescuer) => rescuer.id),
    );
    return rescuerNotHidden;
  }

  public async getNearestPosition(
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

  @OnEvent(EventType.EMERGENCY_TIMEOUT)
  async onEmergencyTimeout(event: EmergencyTimeoutEvent) {
    await this.onEmergencyCreated(event);
  }

  async runTimer(event: EmergencyCreatedEvent, rescuer: Rescuer) {
    //run a 45 seconds timer if no rescuer accept the emergency in this time, the emergency a new rescuer will be assigned
    setTimeout(async () => {
      const emergencyId = event.emergency._id;
      const rescuerId = rescuer._id;

      const emergency = await this.emergencyModel.findById(emergencyId);
      if (!emergency) {
        this.logger.error('Emergency not found with id ' + emergencyId);
        return;
      }
      if (emergency.status === 'ASSIGNED') {
        return;
      }
      //push the rescuer id in the array of hidden rescuers
      this.logger.log(
        'Emergency not accepted after 45 seconds, trying to find a new rescuer',
      );
      emergency.rescuerHidden.push(new Types.ObjectId(rescuerId));
      const result = await this.emergencyModel.updateOne(
        { _id: emergencyId },
        { $push: { rescuerHidden: new Types.ObjectId(rescuerId) } },
      );
      this.logger.log(
        'Rescuer ' +
          rescuerId +
          ' hidden for emergency ' +
          emergencyId +
          ': ' +
          JSON.stringify(result),
      );
      //try to find a new rescuer
      //emit event timeout
      const eventTimeout: EmergencyTimeoutEvent = {
        callCenter: event.callCenter,
        emergency: event.emergency,
        rescuer: rescuer,
      };
      this.event.emit(EventType.EMERGENCY_TIMEOUT, eventTimeout);
    }, 45000);
  }
}
