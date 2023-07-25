import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../guards/jwt.strategy';
import { PositionService } from './position.service';
import { PositionController } from './position.controller';
import { RedisModule } from '../../services/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [PositionController],
  providers: [JwtStrategy, PositionService],
})
export class PositionModule {}
