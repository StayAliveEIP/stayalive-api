import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'availabilityTime' })
export class AvailabilityTime {
  @Prop({ required: true })
  rescuerId: Types.ObjectId;

  @Prop({ required: true })
  day: Date;

  @Prop({ required: true })
  durationInSec: number;
}

export const AvailabilityTimeSchema =
  SchemaFactory.createForClass(AvailabilityTime);
