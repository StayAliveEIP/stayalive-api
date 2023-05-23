import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidation } from "./validation/envValidation";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    // Set up the environment variables.
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
    // Connect to the MongoDB database.
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DATABASE,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
