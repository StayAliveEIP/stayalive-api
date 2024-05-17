import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Defibrillator,
  DefibrillatorSchema,
} from '../../../database/defibrillator.schema';
import { Document, DocumentSchema } from '../../../database/document.schema';
import { AmazonS3Service } from '../../../services/s3/s3.service';
import { DefibrillatorAdminController } from './defibrillator.admin.controller';
import { DefibrillatorAdminService } from './defibrillator.admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Defibrillator.name, schema: DefibrillatorSchema },
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  providers: [DefibrillatorAdminService, AmazonS3Service],
  controllers: [DefibrillatorAdminController],
})
export class DefibrillatorAdminModule {}
