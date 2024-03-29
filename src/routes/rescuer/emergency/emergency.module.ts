import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { Emergency, EmergencySchema } from '../../../database/emergency.schema';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Emergency.name, schema: EmergencySchema },
      { name: Rescuer.name, schema: RescuerSchema },
      { name: CallCenter.name, schema: CallCenterSchema },
    ]),
  ],
  controllers: [EmergencyController],
  providers: [EmergencyService],
})
export class EmergencyModule {}
