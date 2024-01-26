import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../../../guards/jwt.strategy';
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
