import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {Rescuer} from "./rescuer.schema";

@Schema({ versionKey: false, collection: 'links' })
export class Link {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  url: string;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false, default: null })
  expiresAt: Date | null;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
