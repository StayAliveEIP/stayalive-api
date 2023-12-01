import { Module } from '@nestjs/common';
import { RescuerWebsocket } from './rescuer/rescuer.websocket';
import { CallCenterWebsocket } from './callCenter/callCenter.websocket';

@Module({
  providers: [RescuerWebsocket, CallCenterWebsocket],
})
export class WebsocketModule {}
