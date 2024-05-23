import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { DocumentStatus } from './document.schema';

export enum DefibrillatorStatus {
  PENDING = 'PENDING',
  VALIDATED = 'VALIDATED',
  REFUSED = 'REFUSED',
}

@Schema({ versionKey: false, collection: 'defibrillators' })
export class Defibrillator {
  @Prop({ type: Types.ObjectId, required: true })
  proposedBy: Types.ObjectId;
  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  placeId: string;

  @Prop({ required: false })
  address: string;
  @Prop({ required: false })
  pictureUrl: string;
  @Prop({
    required: false,
    type: {
      lat: { type: String, required: false },
      lng: { type: String, required: false },
    },
    _id: false,
  })
  location: {
    lat: string;
    lng: string;
  };
  @Prop({ required: false, default: DocumentStatus.PENDING })
  status: DefibrillatorStatus;
}
export const DefibrillatorSchema = SchemaFactory.createForClass(Defibrillator);
