import { Module } from '@nestjs/common';
import { ChatRescuerController } from './chat.rescuer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../../database/message.schema';
import {
  Conversation,
  ConversationSchema,
} from '../../../database/conversation.schema';
import { ChatRescuerService } from './chat.rescuer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [ChatRescuerController],
  providers: [ChatRescuerService],
})
export class ChatRescuerModule {}
