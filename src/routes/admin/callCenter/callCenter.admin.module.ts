import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { CallCenterAdminService } from './callCenter.admin.service';
import { CallCenterAdminController } from './callCenter.admin.controller';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import { ReactEmailModule } from '../../../services/react-email/react-email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    ReactEmailModule,
    MongooseModule.forFeature([
      { name: CallCenter.name, schema: CallCenterSchema },
    ]),
  ],
  controllers: [CallCenterAdminController],
  providers: [JwtStrategy, CallCenterAdminService],
})
export class CallCenterAdminModule {}
