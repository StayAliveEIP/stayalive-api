import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'rescuers' })
export class Rescuer {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

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
    code: string | null;
    verified: boolean;
  };

  @Prop({
    required: false,
    _id: false,
    type: {
      phone: { type: String, required: true },
      lastCodeSent: { type: Date, required: false, default: null },
      code: { type: String, required: false, default: null },
      verified: { type: Boolean, required: false, default: false },
    },
  })
  phone: {
    phone: string;
    lastCodeSent: Date | null;
    code: string | null;
    verified: boolean;
  };

  @Prop({
    required: false,
    _id: false,
    type: {
      password: { type: String, required: true },
      lastCodeSent: { type: Date, required: false, default: null },
      code: { type: String, required: false, default: null },
      verified: { type: Boolean, required: false, default: false },
    },
  })
  password: {
    password: string;
    lastCodeSent: Date | null;
    code: string | null;
    verified: boolean;
  };
}

export const RescuerSchema = SchemaFactory.createForClass(Rescuer);
