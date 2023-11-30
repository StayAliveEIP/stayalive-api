import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class CallCenterEmail {
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
export class CallCenterPassword {
  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: null })
  token: string | null;

  @Prop({ required: false, default: null })
  lastTokenSent: Date | null;

  @Prop({ required: false, default: null })
  lastChange: Date | null;
}

@Schema({ versionKey: false })
export class CallCenterAddress {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  zip: string;
}

@Schema({ versionKey: false, collection: 'callCenters' })
export class CallCenter {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({
    _id: false,
    required: false,
    type: CallCenterEmail,
  })
  email: CallCenterEmail;

  @Prop({
    _id: false,
    required: false,
    type: CallCenterPassword,
  })
  password: CallCenterPassword;

  @Prop({
    _id: false,
    required: false,
    type: CallCenterAddress,
  })
  address: CallCenterAddress;
}

export const CallCenterSchema = SchemaFactory.createForClass(CallCenter);
