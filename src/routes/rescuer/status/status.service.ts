import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Model, Types } from 'mongoose';
import { StatusDto } from './status.dto';
import { RedisService } from '../../../services/redis/redis.service';
import { Status } from './status.dto';

@Injectable()
export class StatusService {
  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
  ) {}

  async setStatus(userId: Types.ObjectId, status: string): Promise<StatusDto> {
    if (!Object.values(Status).includes(status as Status))
      throw new BadRequestException('Le status est invalide.');
    await this.redisService.setStatusOfRescuer(userId, status as Status);
    return {
      status: status as Status,
    };
  }

  async getStatus(userId: Types.ObjectId): Promise<StatusDto> {
    let status = await this.redisService.getStatusOfRescuer(userId);
    if (!status) status = Status.NOT_AVAILABLE;
    return {
      status,
    };
  }
}
