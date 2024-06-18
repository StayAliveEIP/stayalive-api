import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'reportsBug' })
export class ReportBug {
  @Prop({ required: true })
  rescuerId: Types.ObjectId;

  @Prop({ required: true })
  message: Types.ObjectId;

  @Prop({ required: true })
  pictureUrls: string[];

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  resolved: boolean;
}

export const ReportBugSchema = SchemaFactory.createForClass(ReportBug);
