import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import Redis from 'ioredis';
import type RedisClientType from 'ioredis';
import * as process from 'process';
import { Status } from '../../routes/rescuer/status/status.dto';

export interface RescuerPosition {
  lat: number;
  lng: number;
}

export interface RescuerPositionWithId {
  id: Types.ObjectId;
  position: RescuerPosition;
}

@Injectable()
export class RedisService {
  private readonly logger: Logger = new Logger(RedisService.name);
  private readonly client: RedisClientType;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL);
  }

  public disconnect() {
    this.client.disconnect();
  }

  // Status

  public async getAllRescuerAvailable(): Promise<Types.ObjectId[]> {
    const keys: string[] = await this.client.keys('stayAlive:status:*');
    const rescuers: Types.ObjectId[] = [];
    for (const key of keys) {
      const id: string = key.split(':')[2];
      const status: Status = await this.getStatusOfRescuer(
        new Types.ObjectId(id),
      );
      if (status === Status.AVAILABLE) rescuers.push(new Types.ObjectId(id));
    }
    return rescuers;
  }

  /**
   * Sets the status of the rescuer.
   * @param rescuerId The id of the rescuer.
   * @param status The status of the rescuer.
   */
  public async setStatusOfRescuer(rescuerId: Types.ObjectId, status: Status) {
    const statusKey: string = this.getStatusKey(rescuerId);
    await this.client.set(statusKey, status);
  }

  /**
   * Get the status of the rescuer.
   * @param rescuerId The id of the rescuer.
   */
  public async getStatusOfRescuer(
    rescuerId: Types.ObjectId,
  ): Promise<Status | null> {
    const statusKey: string = this.getStatusKey(rescuerId);
    const status: string = await this.client.get(statusKey);
    if (!status) return null;
    return status as Status;
  }

  public async deleteStatusOfRescuer(rescuerId: Types.ObjectId) {
    const statusKey: string = this.getStatusKey(rescuerId);
    await this.client.del(statusKey);
  }

  public getStatusKey(rescuerId: Types.ObjectId): string {
    return 'stayAlive:status:' + rescuerId.toString();
  }

  // Position

  /**
   * Sets the position of the rescuer.
   * @param rescuerId The id of the rescuer.
   * @param position The position of the rescuer.
   */
  public async setPositionOfRescuer(
    rescuerId: Types.ObjectId,
    position: RescuerPosition,
  ) {
    if (!rescuerId) throw Error('Invalid rescuer id');
    if (!position) throw Error('Invalid position');
    const positionKey: string = this.getPositionKey(rescuerId);
    await this.client.set(positionKey, JSON.stringify(position));
  }

  /**
   * Deletes the position of the rescuer.
   * @param rescuerId The id of the rescuer.
   */
  public async deletePositionOfRescuer(rescuerId: Types.ObjectId) {
    if (!rescuerId) throw Error('Invalid rescuer id');
    const positionKey: string = this.getPositionKey(rescuerId);
    await this.client.del(positionKey);
  }

  /**
   * Returns the position of the rescuer.
   * @param rescuerId The id of the rescuer.
   */
  public async getPositionOfRescuer(
    rescuerId: Types.ObjectId,
  ): Promise<RescuerPosition | null> {
    if (!rescuerId) throw Error('Invalid rescuer id');
    const positionKey: string = this.getPositionKey(rescuerId);
    const position = await this.client.get(positionKey);
    if (!position) return null;
    return JSON.parse(position);
  }

  public async getAllPositions(): Promise<RescuerPositionWithId[]> {
    const keys: string[] = await this.client.keys('stayAlive:position:*');
    const positions: RescuerPositionWithId[] = [];
    for (const key of keys) {
      const id: string = key.split(':')[2];
      const position: RescuerPosition = await this.getPositionOfRescuer(
        new Types.ObjectId(id),
      );
      if (!position) continue;
      positions.push({
        id: new Types.ObjectId(id),
        position,
      });
    }
    return positions;
  }

  public async getAllPosition(
    rescuers: Array<Types.ObjectId>,
  ): Promise<RescuerPositionWithId[]> {
    const positions: RescuerPositionWithId[] = [];
    for (const rescuer of rescuers) {
      const position: RescuerPosition =
        await this.getPositionOfRescuer(rescuer);
      if (!position) continue;
      positions.push({
        id: rescuer,
        position,
      });
    }
    return positions;
  }

  private getPositionKey(rescuerId: Types.ObjectId): string {
    return 'stayAlive:position:' + rescuerId.toString();
  }
}
