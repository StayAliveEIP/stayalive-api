import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { DocumentSchema, Document } from '../../../database/document.schema';
import { RedisModule } from '../../../services/redis/redis.module';
import { ReactEmailModule } from '../../../services/react-email/react-email.module';

@Module({
  imports: [
    RedisModule,
    ReactEmailModule,
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [JwtStrategy, AccountService, ReactEmailService],
})
export class AccountModule {}
