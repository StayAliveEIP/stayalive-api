import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgotPasswordController } from './forgotPassword.controller';
import { ForgotPasswordService } from './forgotPassword.service';
import { MailJetModule } from '../../../services/mailjet/mailjet.module';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MailJetModule,
  ],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
