import { Injectable, NotFoundException } from '@nestjs/common';
import { PositionDeletedDto, PositionDto } from './position.dto';
import {
  RedisService,
  RescuerPosition,
} from '../../services/redis/redis.service';
import { Types } from 'mongoose';

@Injectable()
export class PositionService {
  constructor(private readonly redisService: RedisService) {}

  positionOfId(id: string): Promise<PositionDto> {
    const result: PositionDto = {
      latitude: 0,
      longitude: 0,
    };
    return new Promise((resolve) => {
      resolve(result);
    });
  }

  async getPosition(req: Request): Promise<PositionDto> {
    const id: string = req['user'].userId;
    const objectId: Types.ObjectId = new Types.ObjectId(id);
    const position: RescuerPosition =
      await this.redisService.getPositionOfRescuer(objectId);
    if (!position) throw new NotFoundException('Position introuvable.');
    return {
      latitude: position.lat,
      longitude: position.lng,
    };
  }

  async setPosition(req: Request, body: PositionDto): Promise<PositionDto> {
    const id: string = req['user'].userId;
    const objectId: Types.ObjectId = new Types.ObjectId(id);
    const rescuerPosition: RescuerPosition = {
      lat: body.latitude,
      lng: body.longitude,
    };
    await this.redisService.setPositionOfRescuer(objectId, rescuerPosition);
    return body;
  }

  async deletePosition(req: Request): Promise<PositionDeletedDto> {
    const id: string = req['user'].userId;
    const objectId: Types.ObjectId = new Types.ObjectId(id);
    await this.redisService.deletePositionOfRescuer(objectId);
    return {
      message: 'La position a été supprimée.',
    };
  }
}
