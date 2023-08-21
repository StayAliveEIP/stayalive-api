import mongoose, { Types } from 'mongoose';
import { PositionController } from './position.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../validation/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../database/rescuer.schema';
import { PositionService } from './position.service';
import { RedisModule } from '../../services/redis/redis.module';
import { PositionDto, PositionWithIdDto } from './position.dto';
import { NotFoundException } from '@nestjs/common';
import { SuccessMessage } from '../../dto.dto';
import { RedisService } from '../../services/redis/redis.service';

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
      const result: PositionDto = await positionController.getPosition(
        randomObjectId,
      );
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

  describe('Get all position and the nearest position', () => {
    const randomUser1: Types.ObjectId = new Types.ObjectId();
    const position1: PositionDto = {
      longitude: 5,
      latitude: 5,
    };

    const randomUser2: Types.ObjectId = new Types.ObjectId();
    const position2: PositionDto = {
      longitude: 10,
      latitude: 10,
    };

    it('Try to get nearest with no position in database', async () => {
      try {
        await positionController.getNearestPosition({
          latitude: 0,
          longitude: 0,
        });
      } catch (err) {
        expect(err).toStrictEqual(
          new NotFoundException('Aucune position trouvée.'),
        );
      }
    });

    it('Try to get all positions and the nearest with 2 position in database', async () => {
      // Set the position in the redis
      await positionController.setPosition(randomUser1, position1);
      await positionController.setPosition(randomUser2, position2);

      const positionWithIdDtos = await positionController.getAllPositions();
      expect(positionWithIdDtos).toContainEqual({
        id: randomUser1.toString(),
        latitude: position1.latitude,
        longitude: position1.longitude,
      });
      expect(positionWithIdDtos).toContainEqual({
        id: randomUser2.toString(),
        latitude: position2.latitude,
        longitude: position2.longitude,
      });

      const nearest: PositionWithIdDto =
        await positionController.getNearestPosition({
          latitude: 0,
          longitude: 0,
        });
      const expectedPositionWithId: PositionWithIdDto = {
        id: randomUser1.toString(),
        latitude: position1.latitude,
        longitude: position1.longitude,
      };
      expect(nearest).toStrictEqual(expectedPositionWithId);
      await positionController.deletePosition(randomUser1);
      await positionController.deletePosition(randomUser2);
    });
  });
});
