import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { JwtStrategy } from '../../guards/jwt.strategy';

@Module({
  imports: [],
  controllers: [],
  providers: [JwtStrategy, StatusService],
})
export class StatusModule {}
