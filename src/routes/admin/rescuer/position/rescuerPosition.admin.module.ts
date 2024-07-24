import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../../database/rescuer.schema';
import { Document, DocumentSchema } from '../../../../database/document.schema';
import { JwtStrategy } from '../../../../guards/jwt.strategy';
import { RedisModule } from '../../../../services/redis/redis.module';
import { RescuerPositionAdminController } from './rescuerPosition.admin.controller';
import { RescuerPositionAdminService } from './rescuerPosition.admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
    RedisModule,
  ],
  controllers: [RescuerPositionAdminController],
  providers: [JwtStrategy, RescuerPositionAdminService],
})
export class RescuerPositionAdminModule {}
