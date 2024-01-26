import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { AuthAdminController } from '../../admin/auth/auth.admin.controller';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { AuthAdminService } from '../../admin/auth/auth.admin.service';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { AuthCallCenterController } from './auth.callCenter.controller';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import { AuthCallCenterService } from './auth.callCenter.service';
import { ReactEmailModule } from '../../../services/react-email/react-email.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CallCenter.name, schema: CallCenterSchema },
    ]),
    ReactEmailModule,
  ],
  controllers: [AuthCallCenterController],
  providers: [JwtStrategy, AuthCallCenterService],
})
export class AuthCallCenterModule {}
