import { Module } from '@nestjs/common';
import { RescuerWebsocket } from './rescuer/rescuer.websocket';
import { CallCenterWebsocket } from './callCenter/callCenter.websocket';
import { JwtStrategy } from '../guards/jwt.strategy';
import { ChatWebsocket } from './chat/chat.websocket';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
} from '../database/conversation.schema';
import { Message, MessageSchema } from '../database/message.schema';
import { RedisIoAdapter } from './chat/ws-adapter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  exports: [RescuerWebsocket, CallCenterWebsocket, ChatWebsocket],
  providers: [
    JwtStrategy,
    RescuerWebsocket,
    CallCenterWebsocket,
    ChatWebsocket,
    RedisIoAdapter,
  ],
})
export class WebsocketModule {}
