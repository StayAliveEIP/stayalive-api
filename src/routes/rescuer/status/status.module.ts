import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { StatusController } from './status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { RedisModule } from '../../../services/redis/redis.module';
import { Document, DocumentSchema } from '../../../database/document.schema';
import {
  AvailabilityTime,
  AvailabilityTimeSchema,
} from '../../../database/availabilityTime.schema';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
    MongooseModule.forFeature([
      { name: AvailabilityTime.name, schema: AvailabilityTimeSchema },
    ]),
  ],
  controllers: [StatusController],
  providers: [JwtStrategy, StatusService],
})
export class StatusModule {}
