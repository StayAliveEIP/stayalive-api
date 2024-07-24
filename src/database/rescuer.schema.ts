import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class Suspended {
  @Prop({ required: false, default: false })
  suspended: boolean;

  @Prop({ required: false, default: null })
  reason: string | null;
}

@Schema({ versionKey: false })
export class Email {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false, default: null })
  lastCodeSent: Date | null;

  @Prop({ required: false, default: null })
  code: string | null;

  @Prop({ required: false, default: false })
  verified: boolean;
}

@Schema({ versionKey: false })
export class Phone {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: false, default: null })
  lastCodeSent: Date | null;

  @Prop({ required: false, default: null })
  code: string | null;

  @Prop({ required: false, default: false })
  verified: boolean;
}

@Schema({ versionKey: false })
export class Password {
  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: null })
  token: string | null;

  @Prop({ required: false, default: null })
  lastTokenSent: Date | null;

  @Prop({ required: false, default: null })
  lastChange: Date | null;
}

@Schema({ versionKey: false, collection: 'rescuers' })
export class Rescuer {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({
    _id: false,
    required: false,
    type: Email,
  })
  email: Email;

  @Prop({
    required: false,
    type: String,
  })
  profilePictureUrl: string | undefined | null;

  @Prop({
    _id: false,
    required: false,
    type: Phone,
  })
  phone: Phone;

  @Prop({
    _id: false,
    required: false,
    type: Password,
  })
  password: Password;

  @Prop({
    _id: false,
    required: false,
    type: Suspended,
  })
  suspended: Suspended;
}

export const RescuerSchema = SchemaFactory.createForClass(Rescuer);
