import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Model, Types } from 'mongoose';
import { Status, StatusDto } from './status.dto';
import { RedisService } from '../../../services/redis/redis.service';
import { AvailabilityTime } from '../../../database/availabilityTime.schema';
import { SuccessMessage } from '../../../dto.dto';

@Injectable()
export class StatusService {
  private readonly logger = new Logger(StatusService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(AvailabilityTime.name)
    private availabilityTimeModel: Model<AvailabilityTime>,
  ) {}

  async setStatus(
    userId: Types.ObjectId,
    newStatus: string,
  ): Promise<SuccessMessage> {
    if (!Object.values(Status).includes(newStatus as Status))
      throw new BadRequestException('Le status est invalide.');
    const status = newStatus as Status;

    const availableSince =
      await this.redisService.getAvailableSinceOfRescuer(userId);
    if (availableSince && status == Status.NOT_AVAILABLE) {
      const avSinceDate = new Date(availableSince);
      const durationSec =
        new Date().getUTCSeconds() - avSinceDate.getUTCSeconds();
      await this.availabilityTimeModel.create({
        day: new Date(),
        durationInSec: durationSec,
        rescuerId: userId,
      });
      this.logger.log(
        `Rescuer ${userId} was available for ${durationSec} seconds, and is now not available.`,
      );
    }
    await this.redisService.setStatusOfRescuer(userId, status);
    return {
      message: 'Votre status à bien été mis à jour.',
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
