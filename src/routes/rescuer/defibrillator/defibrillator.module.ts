import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Defibrillator,
  DefibrillatorSchema,
} from '../../../database/defibrillator.schema';
import { AmazonS3Service } from '../../../services/s3/s3.service';
import { DefibrillatorController } from './defibrillator.controller';
import { DefibrillatorService } from './defibrillator.service';
import { Document, DocumentSchema } from '../../../database/document.schema';
import { GoogleApiModule } from '../../../services/google-map/google.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Defibrillator.name, schema: DefibrillatorSchema },
      { name: Document.name, schema: DocumentSchema },
    ]),
    GoogleApiModule,
  ],
  providers: [DefibrillatorService, AmazonS3Service],
  controllers: [DefibrillatorController],
})
export class DefibrillatorModule {}
