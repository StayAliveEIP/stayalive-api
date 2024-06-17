import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false, collection: 'FaqSections' })
export class FaqSection extends Document {
  @ApiProperty({ example: "J'ai un soucis pour me connecter" })
  @Prop({ type: String, required: true })
  title: string;

  @ApiProperty({ example: "Je n'arrive pas à me connecter à mon compte" })
  @Prop({ type: String, required: true })
  description: string;
}

export const FaqSectionSchema = SchemaFactory.createForClass(FaqSection);
