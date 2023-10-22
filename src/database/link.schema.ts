import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

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
