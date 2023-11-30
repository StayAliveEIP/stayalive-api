import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
// Module of rescuer
import { AccountModule as AccountModuleRescuer } from './routes/rescuer/account/account.module';
import { AuthModule as AuthModuleRescuer } from './routes/rescuer/auth/auth.module';
import { StatusModule as StatusModuleRescuer } from './routes/rescuer/status/status.module';
import { EmergencyModule as EmergencyModuleRescuer } from './routes/rescuer/emergency/emergency.module';
import { ForgotPasswordModule as ForgotPasswordModuleRescuer } from './routes/rescuer/account/forgotPassword/forgotPassword.module';
import { DocumentModule as DocumentModuleRescuer } from './routes/rescuer/account/document/document.module';
import { PositionModule as PositionModuleRescuer } from './routes/rescuer/position/position.module';
import { LinkModule as LinkModuleRescuer } from './routes/rescuer/link/link/link.module';
import { AccountAdminModule } from './routes/admin/account/account.admin.module';
import { AuthAdminModule } from './routes/admin/auth/auth.admin.module';
import { CallCenterAdminModule } from './routes/admin/callCenter/callCenter.admin.module';
import { DocumentAdminModule } from './routes/admin/document/document.admin.module';

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
    [
      AuthModuleRescuer,
      AccountModuleRescuer,
      StatusModuleRescuer,
      EmergencyModuleRescuer,
      ForgotPasswordModuleRescuer,
      DocumentModuleRescuer,
      PositionModuleRescuer,
      LinkModuleRescuer,
    ],
  );

  createSwaggerForApi(
    app,
    'swagger/admin',
    'StayAlive API (Admin)',
    'StayAlive API description for admin',
    '1.0',
    [
      AuthAdminModule,
      AccountAdminModule,
      CallCenterAdminModule,
      DocumentAdminModule,
    ],
  );

  createSwaggerForApi(
    app,
    'swagger/call-center',
    'StayAlive API (Call Center)',
    'StayAlive API description for call center',
    '1.0',
    [],
  );

  await app.listen(3000, '0.0.0.0');
}
main();
