import mongoose, { Types } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { RedisModule } from '../../../services/redis/redis.module';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { Status, StatusDto } from './status.dto';

describe('PositionController', () => {
  let statusController: StatusController;

  // TODO: Fix not disconnecting redis

  beforeAll(async () => {
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
      controllers: [StatusController],
      providers: [StatusService],
    }).compile();
    statusController = app.get<StatusController>(StatusController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Test to set and get the status', () => {
    const randomObjectId = new Types.ObjectId();

    it('Get the status as not available because not set', async () => {
      const result: StatusDto =
        await statusController.getStatus(randomObjectId);
      expect(result.status).toBe(Status.NOT_AVAILABLE);
    });

    it('Set the status', async () => {
      const statusDto: StatusDto = {
        status: Status.AVAILABLE,
      };
      const result: StatusDto = await statusController.setStatus(
        randomObjectId,
        statusDto,
      );
      expect(result.status).toBe(statusDto.status);
    });

    it('Get the status as available', async () => {
      const result: StatusDto =
        await statusController.getStatus(randomObjectId);
      expect(result.status).toBe(Status.AVAILABLE);
    });
  });
});
