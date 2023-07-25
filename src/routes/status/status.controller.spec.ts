import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../validation/envValidation';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../database/rescuer.schema';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import mongoose from 'mongoose';

describe('StatusController', () => {
  let statutController: StatusController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        // Set up the environment variables.
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
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
    statutController = app.get<StatusController>(StatusController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('setStatus', () => {
    it('should return void', async () => {
      const result = await statutController.setStatus(
        '60a0d9b3a5d2f9b4e4a9e1b7',
        { status: 'AVAILABLE' },
      );
      expect(result).toBe(undefined);
    });
  });

  describe('getStatus', () => {
    it('should return status', async () => {
      const result = await statutController.getStatus(
        '60a0d9b3a5d2f9b4e4a9e1b7',
      );
      expect(result).toHaveProperty('status');
    });
  });
});
