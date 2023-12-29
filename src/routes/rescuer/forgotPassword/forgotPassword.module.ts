import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgotPasswordController } from './forgotPassword.controller';
import { ForgotPasswordService } from './forgotPassword.service';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { ReactEmailModule } from '../../../services/react-email/react-email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    ReactEmailModule,
  ],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
