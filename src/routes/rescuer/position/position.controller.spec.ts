import mongoose, { Types } from 'mongoose';
import { PositionController } from './position.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { PositionService } from './position.service';
import { RedisModule } from '../../../services/redis/redis.module';
import { PositionDto } from './position.dto';
import { NotFoundException } from '@nestjs/common';
import { SuccessMessage } from '../../../dto.dto';

describe('PositionController', () => {
  let positionController: PositionController;

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
      controllers: [PositionController],
      providers: [PositionService],
    }).compile();
    positionController = app.get<PositionController>(PositionController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    positionController.disconnectRedis();
  });

  describe('Test to set the position of rescuer and get it', () => {
    const randomObjectId = new Types.ObjectId();
    const positionDto: PositionDto = {
      longitude: 1,
      latitude: -1,
    };

    it('Set the position of the rescuer', async () => {
      const result: PositionDto = await positionController.setPosition(
        randomObjectId,
        positionDto,
      );
      expect(result).toBe(positionDto);
    });

    it('Get the previous position inserted', async () => {
      const result: PositionDto =
        await positionController.getPosition(randomObjectId);
      expect(result).toStrictEqual(positionDto);
    });

    it('Delete the previous position', async () => {
      const successMessage: SuccessMessage =
        await positionController.deletePosition(randomObjectId);
      expect(successMessage).toStrictEqual({
        message: 'La position a été supprimée.',
      });
    });

    it('Should return an error if the position was deleted', async () => {
      try {
        await positionController.getPosition(randomObjectId);
      } catch (err) {
        expect(err).toStrictEqual(
          new NotFoundException('Position introuvable.'),
        );
      }
    });
  });
});
