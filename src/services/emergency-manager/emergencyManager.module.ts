import { Module } from '@nestjs/common';
import { EmergencyManagerService } from './emergencyManager.service';
import { RedisModule } from '../redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Emergency, EmergencySchema } from '../../database/emergency.schema';
import { Rescuer, RescuerSchema } from '../../database/rescuer.schema';
import { WebsocketModule } from '../../websocket/websocket.module';
import { RescuerWebsocket } from '../../websocket/rescuer/rescuer.websocket';

@Module({
  providers: [EmergencyManagerService],
  imports: [
    RedisModule,
    WebsocketModule,
    MongooseModule.forFeature([
      { name: Emergency.name, schema: EmergencySchema },
    ]),
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
  ],
  exports: [EmergencyManagerService],
})
export class EmergencyManagerModule {}
