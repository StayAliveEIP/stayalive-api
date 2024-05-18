import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Types } from 'mongoose';
import Redis from 'ioredis';
import type RedisClientType from 'ioredis';
import * as process from 'process';
import { Status } from '../../routes/rescuer/status/status.dto';
import { RedisOptions } from 'ioredis/built/redis/RedisOptions';

export interface RescuerPosition {
  lat: number;
  lng: number;
}

export interface RescuerPositionWithId {
  id: Types.ObjectId;
  position: RescuerPosition;
}

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger: Logger = new Logger(RedisService.name);
  private readonly client: RedisClientType;

  constructor() {
    const port = process.env.REDIS_PORT
      ? parseInt(process.env.REDIS_PORT)
      : undefined;
    const redisOptions: RedisOptions = {
      host: process.env.REDIS_URL,
      port: port,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
    };
    this.logger.log(
      'Connecting to Redis with options: ' + JSON.stringify(redisOptions),
    );
    this.client = new Redis(redisOptions);
    this.client.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });
  }

  onModuleDestroy() {
    this.logger.log('Disconnecting from Redis...');
    this.disconnect();
    this.logger.log('Disconnected from Redis');
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
    // Update status key
    const statusKey: string = this.getStatusKey(rescuerId);
    await this.client.set(statusKey, status);
    // Update active from key
    const activeFromKey: string = this.getAvailableSinceKey(statusKey);
    if (status === Status.AVAILABLE) {
      await this.client.set(activeFromKey, new Date().toISOString());
      return;
    }
    await this.client.del(activeFromKey);
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

  public async getAvailableSinceOfRescuer(
    rescuerId: Types.ObjectId,
  ): Promise<Date | null> {
    const statusKey: string = this.getStatusKey(rescuerId);
    const activeFromKey: string = this.getAvailableSinceKey(statusKey);
    const activeFrom: string = await this.client.get(activeFromKey);
    if (!activeFrom) return null;
    return new Date(activeFrom);
  }

  public async deleteStatusOfRescuer(rescuerId: Types.ObjectId) {
    // Update status key
    const statusKey: string = this.getStatusKey(rescuerId);
    await this.client.del(statusKey);
    // Update active from key
    const activeFromKey: string = this.getAvailableSinceKey(statusKey);
    await this.client.del(activeFromKey);
  }

  public getStatusKey(rescuerId: Types.ObjectId): string {
    return 'stayAlive:status:' + rescuerId.toString();
  }

  public getAvailableSinceKey(key: string): string {
    return 'stayAlive:availableSince:' + key;
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
