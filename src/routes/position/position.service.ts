import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PositionDeletedDto,
  PositionDto,
  PositionWithIdDto,
} from './position.dto';
import {
  RedisService,
  RescuerPosition,
  RescuerPositionWithId,
} from '../../services/redis/redis.service';
import { Types } from 'mongoose';
import {
  GeoCoordinates,
  getDistanceInKilometers,
} from '../../utils/position.utils';

@Injectable()
export class PositionService {
  constructor(private readonly redisService: RedisService) {}

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

  async getAllPositions(): Promise<PositionWithIdDto[]> {
    const positionRedis: RescuerPositionWithId[] =
      await this.redisService.getAllPositions();
    return positionRedis.map((position: RescuerPositionWithId) => {
      const convert: PositionWithIdDto = {
        id: position.id.toString(),
        latitude: position.position.lat,
        longitude: position.position.lng,
      };
      return convert;
    });
  }

  async getNearestPosition(position: PositionDto): Promise<PositionWithIdDto> {
    const allPositions: PositionWithIdDto[] = await this.getAllPositions();
    if (allPositions.length === 0)
      throw new NotFoundException('Aucune position trouvée.');
    const nearestPosition: PositionWithIdDto = allPositions.reduce(
      (prev, curr) => {
        getDistanceInKilometers(
          new GeoCoordinates(position.latitude, position.longitude),
          new GeoCoordinates(curr.latitude, curr.longitude),
        );
        const prevDistance: number = getDistanceInKilometers(
          new GeoCoordinates(position.latitude, position.longitude),
          new GeoCoordinates(prev.latitude, prev.longitude),
        );
        const currDistance: number = getDistanceInKilometers(
          new GeoCoordinates(position.latitude, position.longitude),
          new GeoCoordinates(curr.latitude, curr.longitude),
        );
        return prevDistance < currDistance ? prev : curr;
      },
    );
    return nearestPosition;
  }
}
