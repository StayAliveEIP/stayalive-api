import mongoose from 'mongoose';
import { PositionController } from './position.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../validation/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../database/rescuer.schema';
import { PositionService } from './position.service';
import { RedisModule } from '../../services/redis/redis.module';

describe('PositionController', () => {
  let positionController: PositionController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        // Set up the environment variables.
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
        RedisModule,
        // Connect to the MongoDB database.
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          dbName: process.env.MONGODB_DATABASE,
        }),
        // Get the rescuer model.
        MongooseModule.forFeature([
          { name: Rescuer.name, schema: RescuerSchema },
        ]),
      ],
      controllers: [PositionController],
      providers: [PositionService],
    }).compile();
    positionController = app.get<PositionController>(PositionController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Test to set the position of rescuer and get it', () => {
    it('should pass the register and get the message', async () => {});
  });
});
