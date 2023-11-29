import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../../database/rescuer.schema';
import { Document, DocumentSchema } from '../../../../database/document.schema';
import { JwtStrategy } from '../../../../guards/jwt.strategy';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [DocumentController],
  providers: [JwtStrategy, DocumentService],
})
export class DocumentModule {}
