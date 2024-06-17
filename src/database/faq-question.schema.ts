import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, collection: 'FaqQuestions' })
export class FaqQuestion {
  @Prop({ type: String, required: true })
  subsection: string;

  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: String, required: true })
  answer: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  modifiedAt: Date;
}

export const HelpQuestionSchema = SchemaFactory.createForClass(FaqQuestion);
