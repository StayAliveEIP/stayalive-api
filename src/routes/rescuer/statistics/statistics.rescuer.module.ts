import { Module } from '@nestjs/common';
import { RedisModule } from '../../../services/redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { Document, DocumentSchema } from '../../../database/document.schema';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { StatisticsRescuerService } from './statistics.rescuer.service';
import { StatisticsRescuerController } from './statistics.rescuer.controller';
import { Emergency, EmergencySchema } from '../../../database/emergency.schema';
import {
  AvailabilityTime,
  AvailabilityTimeSchema,
} from '../../../database/availabilityTime.schema';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
    MongooseModule.forFeature([
      { name: Emergency.name, schema: EmergencySchema },
    ]),
    MongooseModule.forFeature([
      { name: AvailabilityTime.name, schema: AvailabilityTimeSchema },
    ]),
  ],
  controllers: [StatisticsRescuerController],
  providers: [JwtStrategy, StatisticsRescuerService],
})
export class StatisticsRescuerModule {}
