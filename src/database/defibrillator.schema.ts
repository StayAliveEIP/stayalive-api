import { Schema } from '@nestjs/mongoose';

@Schema({ versionKey: false, collection: 'defibrillators' })
export class Defibrillator {
  _id: string;
  name: string;
  address: string;
  pictureUrl: string;
  location: {
    x: string;
    y: string;
  };
}
