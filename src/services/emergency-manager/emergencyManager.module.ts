import { Module } from '@nestjs/common';
import { EmergencyManagerService } from './emergencyManager.service';
import { RedisModule } from '../redis/redis.module';
import { RescuerWebsocket } from '../../websocket/rescuer/rescuer.websocket';

@Module({
  providers: [EmergencyManagerService],
  imports: [RedisModule],
  exports: [EmergencyManagerService],
})
export class EmergencyManagerModule {}
