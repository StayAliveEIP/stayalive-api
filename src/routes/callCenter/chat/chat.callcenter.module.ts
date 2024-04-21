import { Module } from '@nestjs/common';
import { ChatCallcenterController } from './chat.callcenter.controller';
import { ChatCallCenterService } from './chat.callcenter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../../database/message.schema';
import {
  Conversation,
  ConversationSchema,
} from '../../../database/conversation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [ChatCallcenterController],
  providers: [ChatCallCenterService],
})
export class ChatCallcenterModule {}
