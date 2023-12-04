import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// TODO: Remove this schema because it's not used anymore

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
  @Prop({ type: Types.ObjectId, required: false })
  for: string;
  @Prop({ required: true, default: Date.now })
  date: Date;
  @Prop({ required: true })
  description: string;
  @Prop({ required: false, default: 'PENDING' })
  status: string;
  @Prop({ required: false })
  assignedTo?: string;
}

export const CallSchema = SchemaFactory.createForClass(Call);
