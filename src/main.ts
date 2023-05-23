import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConsoleLogger } from "@nestjs/common";

async function main() {
  const redis = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        retryAttempts: 5,
        retryDelay: 1000,
      },
    },
  );
  await redis.listen();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000, '0.0.0.0');
}
main();
