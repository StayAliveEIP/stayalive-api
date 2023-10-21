import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export enum DocumentType {
  ID_CARD = 'ID_CARD',
  RESCUER_CERTIFICATE = 'RESCUER_CERTIFICATE',
}

export enum DocumentStatus {
  VALID = 'VALID',
  NOT_VALID = 'NOT_VALID',
  PENDING = 'PENDING',
}

@Schema({ versionKey: false, collection: 'documents' })
export class Document {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  type: DocumentType;

  @Prop({ required: false, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Prop({ required: false, default: null })
  message: string | null;

  @Prop({ required: false, default: new Date() })
  lastUpdate: Date;

  @Prop({ required: true })
  binaryFile: Buffer;

  @Prop({ required: true })
  mimeType: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
