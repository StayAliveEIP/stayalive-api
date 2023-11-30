import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { CallCenterAdminService } from './callCenter.admin.service';
import { CallCenterAdminController } from './callCenter.admin.controller';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([
      { name: CallCenter.name, schema: CallCenterSchema },
    ]),
  ],
  controllers: [CallCenterAdminController],
  providers: [JwtStrategy, CallCenterAdminService, ReactEmailService],
})
export class CallCenterAdminModule {}
