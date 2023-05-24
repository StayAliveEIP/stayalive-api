import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'centers' })
export class Center {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  city: string;

  @Prop({
    required: false,
    _id: false,
    type: {
      email: { type: String, required: true },
      lastCodeSent: { type: Date, required: false, default: null },
      code: { type: String, required: false, default: null },
      verified: { type: Boolean, required: false, default: false },
    },
  })
  email: {
    email: string;
    lastCodeSent: Date | null;
    code: string | null; //OPTIONAL
    verified: boolean; //OPTIONAL
  };

  @Prop({
    required: false,
    _id: false,
  })
  phone: string;

  @Prop({
    required: false,
    _id: false,
    type: {
      password: { type: String, required: true },
      lastChange: { type: Date, required: false, default: null },
    },
  })
  password: {
    password: string;
    lastChange: Date | null;
  };
}

export const RescuerSchema = SchemaFactory.createForClass(Center);
