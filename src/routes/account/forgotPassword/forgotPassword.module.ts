import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgotPasswordController } from './forgotPassword.controller';
import { ForgotPasswordService } from './forgotPassword.service';
import { Rescuer } from '../../../schemas/rescuer.schema';
import { RescuerSchema } from '../../../schemas/center.schema';
import { MailJetModule } from '../../../services/mailjet/mailjet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MailJetModule,
  ],
  controllers: [ForgotPasswordController],
  providers: [ForgotPasswordService],
})
export class ForgotPasswordModule {}
