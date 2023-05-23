import {Prop, Schema} from '@nestjs/mongoose';

@Schema({ versionKey: false, collection: 'users' })
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  lastChange: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
