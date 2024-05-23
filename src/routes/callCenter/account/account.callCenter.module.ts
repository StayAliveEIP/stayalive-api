import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import { ReactEmailModule } from '../../../services/react-email/react-email.module';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { AccountCallCenterController } from './account.callCenter.controller';
import { AccountCallCenterService } from './account.callCenter.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CallCenter.name, schema: CallCenterSchema },
    ]),
    ReactEmailModule,
  ],
  controllers: [AccountCallCenterController],
  providers: [JwtStrategy, AccountCallCenterService],
})
export class AccountCallCenterModule {}
