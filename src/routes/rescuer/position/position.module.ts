import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../../guards/jwt.strategy';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { RedisModule } from '../../../services/redis/redis.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';

@Module({
  imports: [
    RedisModule,
    MongooseModule.forFeature([{ name: Rescuer.name, schema: RescuerSchema }]),
  ],
  controllers: [PositionController],
  providers: [JwtStrategy, PositionService],
})
export class PositionModule {}
