import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidation } from "./validation/envValidation";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    // Set up the environment variables.
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidation }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
