import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../schemas/rescuer.schema';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { JwtStrategy } from '../../guards/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
  ],
  controllers: [AccountController],
  providers: [JwtStrategy, AccountService],
})
export class AccountModule {}
