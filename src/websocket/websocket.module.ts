import { Module } from '@nestjs/common';
import { RescuerWebsocket } from './rescuer/rescuer.websocket';
import { CallCenterWebsocket } from './callCenter/callCenter.websocket';
import { JwtStrategy } from '../guards/jwt.strategy';
import { ChatWebsocket } from './chat/chat.websocket';

@Module({
  imports: [],
  exports: [RescuerWebsocket, CallCenterWebsocket, ChatWebsocket],
  providers: [
    JwtStrategy,
    RescuerWebsocket,
    CallCenterWebsocket,
    ChatWebsocket,
  ],
})
export class WebsocketModule {}
