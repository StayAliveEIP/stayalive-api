import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../../services/redis/redis.service';
import { InjectModel } from '@nestjs/mongoose';
import { Rescuer } from '../../../database/rescuer.schema';
import { Model, Types } from 'mongoose';
import {
  AvailabilityDay,
  SuccessElement,
  SuccessType,
} from './statistics.rescuer.dto';
import { Emergency, EmergencyStatus } from '../../../database/emergency.schema';
import { AvailabilityTime } from '../../../database/availabilityTime.schema';
import { Document } from '../../../database/document.schema';

@Injectable()
export class StatisticsRescuerService {
  private readonly logger = new Logger(StatisticsRescuerService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectModel(Rescuer.name) private rescuerModel: Model<Rescuer>,
    @InjectModel(Emergency.name) private emergencyModel: Model<Emergency>,
    @InjectModel(Document.name) private documentModel: Model<Document>,
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
    const emergencySuccess = await this.getEmergencySuccess(userId);
    const availabilitySuccess = await this.getAvailabilitySuccess(userId);
    return [...emergencySuccess, ...availabilitySuccess];
  }

  private async getEmergencySuccess(
    userId: Types.ObjectId,
  ): Promise<Array<SuccessElement>> {
    const count = [1, 10, 25, 50, 100];
    const resolvedByRescuer = await this.emergencyModel
      .find({ rescuerId: userId, status: EmergencyStatus.RESOLVED })
      .countDocuments();
    const result: Array<SuccessElement> = [];
    for (const c of count) {
      const isSuccess = resolvedByRescuer >= c;
      result.push({
        name: 'Résoudre ' + c + ' urgences',
        isSuccessful: isSuccess,
        type: SuccessType.EMERGENCY,
      });
    }
    return result;
  }

  private async getAvailabilitySuccess(
    userId: Types.ObjectId,
  ): Promise<Array<SuccessElement>> {
    const count = [7, 15, 30, 60];
    const now = new Date();
    const first = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 60);
    const last = new Date(now.getTime() - 1000 * 60 * 60 * 24);
    const availabilities = await this.availabilityTimeModel.find({
      rescuerId: userId,
      day: {
        $gte: first,
        $lt: last,
      },
    });
    const result: Array<SuccessElement> = [];
    for (const c of count) {
      const first = new Date(now.getTime() - 1000 * 60 * 60 * 24 * c);
      const avTimeCount = availabilities
        .filter(
          (availability) =>
            availability.day.getDate() >= first.getUTCDate() &&
            availability.day.getDate() <= now.getUTCDate(),
        )
        .filter((availability) => availability.durationInSec > 0).length;
      result.push({
        name: `Se rendre disponible ${c} jours d'affilé`,
        isSuccessful: avTimeCount >= c,
        type: SuccessType.CONNECTION_TIME,
      });
    }
    return result;
  }
}
