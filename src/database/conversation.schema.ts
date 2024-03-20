import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from './document.schema';

@Schema({ versionKey: false, collection: 'conversations' })
export class Conversation {}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
