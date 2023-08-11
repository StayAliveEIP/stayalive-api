import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidation } from './validation/envValidation';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './routes/auth/auth.module';
import { AccountModule } from './routes/account/account.module';
import { ForgotPasswordModule } from './routes/account/forgotPassword/forgotPassword.module';
import { RedisModule } from './services/redis/redis.module';
import { RedisService } from './services/redis/redis.service';
import { PositionModule } from './routes/position/position.module';
import { DocumentModule } from './routes/account/document/document.module';

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
    AuthModule,
    AccountModule,
    ForgotPasswordModule,
    PositionModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
})
export class AppModule {}
