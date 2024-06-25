import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false, collection: 'reportsFeedback' })
export class ReportFeedback {
  @Prop({ required: true })
  rescuerId: Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  goodPoints: string;

  @Prop({ required: true })
  badPoints: string;

  @Prop({ required: true })
  ideaAndSuggestions: string;
}

export const ReportFeedbackSchema =
  SchemaFactory.createForClass(ReportFeedback);
