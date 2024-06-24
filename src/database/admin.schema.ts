import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class AdminEmail {
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
export class AdminPassword {
  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: null })
  token: string | null;

  @Prop({ required: false, default: null })
  lastTokenSent: Date | null;

  @Prop({ required: false, default: null })
  lastChange: Date | null;
}

@Schema({ versionKey: false, collection: 'admins' })
export class Admin {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop({
    required: false,
    default: null,
  })
  profilePictureUrl: string | null;

  @Prop({
    _id: false,
    required: false,
    type: AdminEmail,
  })
  email: AdminEmail;

  @Prop({
    _id: false,
    required: false,
    type: AdminPassword,
  })
  password: AdminPassword;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
