import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum ConversationStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

@Schema({ versionKey: false, collection: 'conversations' })
export class Conversation {
  @Prop({ required: true })
  callCenterId: Types.ObjectId;

  @Prop({ required: true })
  rescuerId: Types.ObjectId;

  @Prop({ required: true })
  emergencyId: Types.ObjectId;

  @Prop({ required: true })
  status: ConversationStatus;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
