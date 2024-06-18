import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidation } from './validation/env.validation';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './routes/rescuer/auth/auth.module';
import { AccountModule } from './routes/rescuer/account/account.module';
import { ForgotPasswordModule } from './routes/rescuer/forgotPassword/forgotPassword.module';
import { RedisModule } from './services/redis/redis.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EmergencyModule } from './routes/rescuer/emergency/emergency.module';
import { PositionModule } from './routes/rescuer/position/position.module';
import { DocumentModule } from './routes/rescuer/document/document.module';
import { StatusModule } from './routes/rescuer/status/status.module';
import { AccountAdminModule } from './routes/admin/account/account.admin.module';
import { AuthAdminModule } from './routes/admin/auth/auth.admin.module';
import { CallCenterAdminModule } from './routes/admin/callCenter/callCenter.admin.module';
import { DocumentAdminModule } from './routes/admin/document/document.admin.module';
import { AuthCallCenterModule } from './routes/callCenter/auth/auth.callCenter.module';
import { WebsocketModule } from './websocket/websocket.module';
import { EmergencyCallCenterModule } from './routes/callCenter/emergency/emergency.callCenter.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmergencyManagerModule } from './services/emergency-manager/emergencyManager.module';
import { ReactEmailModule } from './services/react-email/react-email.module';
import { DefibrillatorModule } from './routes/rescuer/defibrillator/defibrillator.module';
import { ChatRescuerModule } from './routes/rescuer/chat/chat.rescuer.module';
import { ChatCallcenterModule } from './routes/callCenter/chat/chat.callcenter.module';
import { ForgotPasswordCallCenterModule } from './routes/callCenter/forgotPassword/forgotPassword.callCenter.module';
import { DefibrillatorAdminModule } from './routes/admin/defibrillator/defibrillator.admin.module';
import { StatisticsRescuerModule } from './routes/rescuer/statistics/statistics.rescuer.module';
import { AccountCallCenterModule } from './routes/callCenter/account/account.callCenter.module';
import { ReportRescuerModule } from './routes/rescuer/report/report.rescuer.module';
import { ReportAdminModule } from './routes/admin/report/report.admin.module';

@Module({
  imports: [
    // Configure the event
    EventEmitterModule.forRoot(),
    // Add react email module.
    ReactEmailModule,
    // Configure the urgency event manager
    EmergencyManagerModule,
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
    StatisticsRescuerModule,
    ReportRescuerModule,
    // Admin modules.
    AuthAdminModule,
    AccountAdminModule,
    CallCenterAdminModule,
    DocumentAdminModule,
    DefibrillatorAdminModule,
    ReportAdminModule,
    // Call center module
    AuthCallCenterModule,
    AccountCallCenterModule,
    ForgotPasswordCallCenterModule,
    EmergencyCallCenterModule,
    // Websocket module
    WebsocketModule,
    DefibrillatorModule,
    ChatRescuerModule,
    ChatCallcenterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
