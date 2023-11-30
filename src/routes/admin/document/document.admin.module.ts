import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { DocumentSchema, Document } from '../../../database/document.schema';
import { DocumentAdminService } from './document.admin.service';
import { DocumentAdminController } from './document.admin.controller';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [DocumentAdminController],
  providers: [JwtStrategy, DocumentAdminService, ReactEmailService],
})
export class DocumentAdminModule {}
