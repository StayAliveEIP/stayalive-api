import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'REDIS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
          retryAttempts: 5,
          retryDelay: 1000,
        },
      },
    ]),
  ],
  controllers: [],
  providers: [RedisService],
})
export class RedisModule {}
