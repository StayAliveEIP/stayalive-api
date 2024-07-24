import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { Document, DocumentSchema } from '../../../database/document.schema';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { RescuerAdminController } from './rescuer.admin.controller';
import { RescuerAdminService } from './rescuer.admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [RescuerAdminController],
  providers: [JwtStrategy, RescuerAdminService],
})
export class RescuerAdminModule {}
