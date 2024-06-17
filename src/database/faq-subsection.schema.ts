import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false, collection: 'FaqSubsections' })
export class FaqSubsection extends Document {
  @ApiProperty({ type: Types.ObjectId, example: '60a8c4a7fa4e05000bde14a0' })
  _id: Types.ObjectId;

  @ApiProperty({ example: 'How to create a new account?' })
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty({ example: 'This is a description' })
  @Prop({ type: String, required: true })
  description: string;

  @ApiProperty({ type: Types.ObjectId, example: '60a8c4a7fa4e05000bde14a0' })
  @Prop({ type: Types.ObjectId, required: true })
  section: Types.ObjectId;
}

export const FaqSubsectionSchema = SchemaFactory.createForClass(FaqSubsection);
