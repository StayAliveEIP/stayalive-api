import { Module } from '@nestjs/common';
import { EmergencyManagerService } from './emergencyManager.service';
import { RedisModule } from '../redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import {Emergency, EmergencySchema} from "../../database/emergency.schema";

@Module({
  providers: [EmergencyManagerService],
  imports: [
    RedisModule,
    MongooseModule.forFeature([
      { name: Emergency.name, schema: EmergencySchema },
    ]),
  ],
  exports: [EmergencyManagerService],
})
export class EmergencyManagerModule {}
