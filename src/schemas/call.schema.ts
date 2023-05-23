import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'calls' })
export class Call {
  @Prop({ type: Types.ObjectId, required: true })
  from: string;
  @Prop({
    type: {
      x: { type: String, required: true },
      y: { type: String, required: true },
    },
    required: true,
  })
  at: {
    x: string;
    y: string;
  };
  @Prop({ type: Types.ObjectId, required: true })
  for: string;
  @Prop({ type: Types.ObjectId, required: true })
  center: string;
  @Prop({ required: true })
  date: Date;
}

export const CallSchema = SchemaFactory.createForClass(Call);
