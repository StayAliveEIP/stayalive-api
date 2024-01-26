import { Module } from '@nestjs/common';
import { RescuerWebsocket } from './rescuer/rescuer.websocket';
import { CallCenterWebsocket } from './callCenter/callCenter.websocket';
import { JwtStrategy } from '../guards/jwt.strategy';

@Module({
  imports: [],
  exports: [RescuerWebsocket, CallCenterWebsocket],
  providers: [JwtStrategy, RescuerWebsocket, CallCenterWebsocket],
})
export class WebsocketModule {}
