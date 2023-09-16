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
  @Prop({ type: Types.ObjectId, required: false})
  for: string;
  @Prop({ required: true, default: Date.now })
  date: Date;
  @Prop({ required: true })
  description: string;
  @Prop({
    type: { enum: ['cancelled', 'rejected', 'pending', 'finished'] },
    required: true,
    default: 'pending',
  })
  status: string;
}

export const CallSchema = SchemaFactory.createForClass(Call);
