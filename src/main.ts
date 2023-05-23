import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function main() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, '0.0.0.0');
}
main();
