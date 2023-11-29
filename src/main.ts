import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AccountModule } from './routes/rescuer/account/account.module';
import * as url from 'url';

/*
async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('StayAlive Api')
    .setDescription('StayAlive Api description')
    .setVersion('1.0')
    .setContact(
      'Team StayAlive',
      'https://www.stayalive.fr',
      'stayalive.eip@gmail.com',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // const internalApiDocument = SwaggerModule.createDocument(app, config, {
  //   include: [AccountModule],
  // });
  // SwaggerModule.setup('api/internal', app, internalApiDocument);

  await app.listen(3000, '0.0.0.0');
}
*/

const createSwaggerForApi = (
  app: INestApplication,
  path: string,
  title: string,
  description: string,
  version: string,
  modules: any[],
) => {
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth()
    .setContact(
      'Team StayAlive',
      'https://www.stayalive.fr',
      'stayalive.eip@gmail.com',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: modules,
  });
  SwaggerModule.setup(path, app, document);
};
async function main() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  createSwaggerForApi(
    app,
    'swagger/rescuer',
    'StayAlive API (Rescuer)',
    'StayAlive API description for rescuer',
    '1.0',
    [AccountModule],
  );

  createSwaggerForApi(
    app,
    'swagger/admin',
    'StayAlive API (Admin)',
    'StayAlive API description for admin',
    '1.0',
    [AccountModule],
  );

  createSwaggerForApi(
    app,
    'swagger/call-center',
    'StayAlive API (Call Center)',
    'StayAlive API description for call center',
    '1.0',
    [AccountModule],
  );

  await app.listen(3000, '0.0.0.0');
}
main();
