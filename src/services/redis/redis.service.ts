import { createClient } from 'redis';
import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { async } from 'rxjs';
import Redis from 'ioredis';
import type RedisClientType from 'ioredis';
import * as process from 'process';

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
      positions.push({
        id: new Types.ObjectId(id),
        position,
      });
    }
    return positions;
  }

  private getPositionKey(rescuerId: Types.ObjectId): string {
    return 'stayAlive:position:' + rescuerId.toString();
  }
}
