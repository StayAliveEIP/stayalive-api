import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Admin } from './admin.schema';
import { Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'defibrillators' })
export class Defibrillator {
  @Prop({ type: Types.ObjectId, required: true })
  proposedBy: Types.ObjectId;
  @Prop({ required: false })
  name: string;
  @Prop({ required: false })
  address: string;
  @Prop({ required: false })
  pictureUrl: string;
  @Prop({
    required: false,
    type: {
      x: { type: String, required: false },
      y: { type: String, required: false },
    },
  })
  location: {
    x: string;
    y: string;
  };
  @Prop({ required: false })
  status: string;
}
export const DefibrillatorSchema = SchemaFactory.createForClass(Defibrillator);
