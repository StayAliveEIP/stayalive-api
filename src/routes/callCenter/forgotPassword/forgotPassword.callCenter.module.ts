import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import { ReactEmailModule } from '../../../services/react-email/react-email.module';
import { ForgotPasswordCallCenterController } from './forgotPassword.callCenter.controller';
import { ForgotPasswordCallCenterService } from './forgotPassword.callCenter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CallCenter.name, schema: CallCenterSchema },
    ]),
    ReactEmailModule,
  ],
  controllers: [ForgotPasswordCallCenterController],
  providers: [ForgotPasswordCallCenterService],
})
export class ForgotPasswordCallCenterModule {}
