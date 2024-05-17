import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../../services/redis/redis.service';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Model, Types } from 'mongoose';
import { AvailabilityDay, SuccessElement } from './statistics.rescuer.dto';
import { Emergency } from '../../../database/emergency.schema';
import { AvailabilityTime } from '../../../database/availabilityTime.schema';

@Injectable()
export class StatisticsRescuerService {
  private readonly logger = new Logger(StatisticsRescuerService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(AvailabilityTime.name)
    private availabilityTimeModel: Model<AvailabilityTime>,
  ) {}

  async getAvailability(
    userId: Types.ObjectId,
  ): Promise<Array<AvailabilityDay>> {
    const days = 30;
    const now = new Date();
    const lastMonth = new Date(now.getDate() - 1000 * 60 * 60 * 24 * days);
    const emergencies = await this.availabilityTimeModel.find({
      rescuerId: userId,
      day: {
        $gte: lastMonth,
        $lt: now,
      },
    });

    const result: AvailabilityDay[] = [];
    for (let i = 0; i < days; i++) {
      const day = new Date(now.getTime() - 1000 * 60 * 60 * 24 * i);
      const dayEmergencies = emergencies.filter(
        (emergency) =>
          emergency.day.getUTCDay() === day.getUTCDay() &&
          emergency.day.getUTCMonth() === day.getUTCMonth() &&
          emergency.day.getUTCFullYear() === day.getUTCFullYear(),
      );
      day.setHours(0, 0, 0, 0);
      result.push({
        // Remove hours, minute and second to day
        date: day,
        timeInSec: dayEmergencies.reduce(
          (acc, curr) => acc + curr.durationInSec,
          0,
        ),
      });
    }
    // Add the time that the rescuer is available if he is available today
    const avSince = await this.redisService.getAvailableSinceOfRescuer(userId);
    if (avSince) {
      const avSinceDate = new Date(avSince);
      const durationSec = now.getUTCSeconds() - avSinceDate.getUTCSeconds();
      result[0].timeInSec += durationSec;
    }
    return result;
  }

  async getSuccess(userId: Types.ObjectId): Promise<Array<SuccessElement>> {
    return [];
  }
}
