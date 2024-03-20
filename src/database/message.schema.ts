import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Conversation } from './conversation.schema';

@Schema({ versionKey: false, collection: 'messages' })
export class Message {}

export const MessageSchema = SchemaFactory.createForClass(Message);
