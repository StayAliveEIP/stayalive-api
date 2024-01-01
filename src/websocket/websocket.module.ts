import { Module } from '@nestjs/common';
import { RescuerWebsocket } from './rescuer/rescuer.websocket';
import { CallCenterWebsocket } from './callCenter/callCenter.websocket';
import { JwtStrategy } from '../guards/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../database/rescuer.schema';

@Module({
  imports: [
  ],
  providers: [JwtStrategy, RescuerWebsocket, CallCenterWebsocket],
})
export class WebsocketModule {}
