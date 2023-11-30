import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidation } from './validation/env.validation';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './routes/rescuer/auth/auth.module';
import { AccountModule } from './routes/rescuer/account/account.module';
import { ForgotPasswordModule } from './routes/rescuer/account/forgotPassword/forgotPassword.module';
import { RedisModule } from './services/redis/redis.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmergencyModule } from './routes/rescuer/emergency/emergency.module';
import { PositionModule } from './routes/rescuer/position/position.module';
import { DocumentModule } from './routes/rescuer/account/document/document.module';
import { StatusModule } from './routes/rescuer/status/status.module';
import { LinkModule } from './routes/rescuer/link/link/link.module';
import { AccountAdminModule } from './routes/admin/account/account.admin.module';
import { AuthAdminModule } from './routes/admin/auth/auth.admin.module';

@Module({
  imports: [
    // Set up the environment variables.
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
    // Connect to the MongoDB database.
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DATABASE,
    }),
    // Add the Redis module.
    RedisModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    // Rescuer modules.
    AuthModule,
    AccountModule,
    StatusModule,
    EmergencyModule,
    ForgotPasswordModule,
    DocumentModule,
    PositionModule,
    LinkModule,
    // Admin modules.
    AuthAdminModule,
    AccountAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
