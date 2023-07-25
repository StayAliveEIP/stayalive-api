import { createClient } from 'redis';
import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';

export interface RescuerPosition {
  lat: number;
  lng: number;
}

@Injectable()
export class RedisService {
  private readonly logger: Logger = new Logger(RedisService.name);
  private readonly client;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
    });
    this.client
      .connect()
      .then(() => {
        this.logger.log('Connected to Redis database');
      })
      .catch((err) => {
        this.logger.error(err);
        process.exit(1);
      });
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
    await this.client.set(rescuerId.toString(), JSON.stringify(position));
  }

  /**
   * Deletes the position of the rescuer.
   * @param rescuerId The id of the rescuer.
   */
  public async deletePositionOfRescuer(rescuerId: Types.ObjectId) {
    if (!rescuerId) throw Error('Invalid rescuer id');
    await this.client.del(rescuerId.toString());
  }

  /**
   * Returns the position of the rescuer.
   * @param rescuerId The id of the rescuer.
   */
  public async getPositionOfRescuer(
    rescuerId: Types.ObjectId,
  ): Promise<RescuerPosition | null> {
    if (!rescuerId) throw Error('Invalid rescuer id');
    const position = await this.client.get(rescuerId.toString());
    if (!position) return null;
    return JSON.parse(position);
  }
}
