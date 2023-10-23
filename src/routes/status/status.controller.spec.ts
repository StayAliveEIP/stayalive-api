import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../validation/env.validation';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../database/rescuer.schema';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import mongoose, { Model, Types } from 'mongoose';

describe('StatusController', () => {
  let statutController: StatusController;

  let rescuerModel;

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

    rescuerModel = app.get<Model<Rescuer>>(getModelToken(Rescuer.name));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('setStatus and getStatus', async () => {
    const randomObjectId = new Types.ObjectId();
    const rescuer = await rescuerModel.findOne({ firstname: 'test' });
    const rescuerId = rescuer._id;
    it('should return void', async () => {

      const result = await statutController.setStatus(rescuerId, {
        status: 'AVAILABLE',
      });
      expect(result).toBe(undefined);
    });

    it('should return status', async () => {
      const result = await statutController.getStatus(rescuerId);
      expect(result).toHaveProperty('status');
    });
  });
});
