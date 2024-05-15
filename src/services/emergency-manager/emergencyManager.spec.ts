import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../validation/env.validation';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CallCenter } from '../../database/callCenter.schema';
import { ReactEmailService } from '../react-email/react-email.service';
import mongoose, { Types, UpdateWriteOpResult } from 'mongoose';
import { EmergencyManagerService } from './emergencyManager.service';
import { Emergency, EmergencyStatus } from '../../database/emergency.schema';
import { WebsocketModule } from '../../websocket/websocket.module';
import { RedisModule } from '../redis/redis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Rescuer } from '../../database/rescuer.schema';
import { EmergencyCreatedEvent } from './emergencyManager.dto';
import { RedisService, RescuerPositionWithId } from '../redis/redis.service';
import { Status } from '../../routes/rescuer/status/status.dto';
import { RescuerWebsocket } from '../../websocket/rescuer/rescuer.websocket';

const RESCUER_MOCK: Rescuer = {
  _id: new Types.ObjectId(),
  email: {
    email: 'test@test.net',
    code: '123456',
    lastCodeSent: null,
    verified: true,
  },
  profilePictureUrl: null,
  firstname: 'Test',
  lastname: 'Test',
  password: {
    password: 'fsongfsdjbfgopsd',
    lastChange: null,
    lastTokenSent: null,
    token: null,
  },
  phone: {
    phone: '123456789',
    code: '123456',
    lastCodeSent: null,
    verified: true,
  },
};

class RescuerModelMock {
  constructor(public data: Rescuer) {}
  static findById = jest.fn().mockImplementation(() => {
    return new RescuerModelMock(RESCUER_MOCK).data;
  });
}

class EmergencyModelMock {
  constructor(public data: Emergency) {}
  static findById = jest.fn().mockImplementation(() => {
    return new EmergencyModelMock(EMERGENCY).data;
  });
  static updateOne = jest.fn().mockImplementation(() => {
    const result: UpdateWriteOpResult = {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedId: null,
      upsertedCount: 0,
    };
    return result;
  });
}

class CallCenterModelMock {
  constructor(public data: CallCenter) {}
  static findById = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(CALL_CENTER).data;
  });
}

const CALL_CENTER: CallCenter = {
  _id: new Types.ObjectId(),
  name: 'Call Center',
  email: {
    email: 'call@center.net',
    code: '123456',
    lastCodeSent: new Date(),
    verified: true,
  },
  password: {
    password: 'fsongfsdjbfgopsd',
    token: 'fsongfsdjbfgopsd',
    lastChange: new Date(),
    lastTokenSent: new Date(),
  },
  address: {
    city: 'City',
    zip: '12345',
    street: 'Street',
  },
  phone: '123456789',
};

const EMERGENCY: Emergency = {
  _id: new Types.ObjectId(),
  address: 'Address',
  info: 'Info',
  callCenterId: CALL_CENTER._id,
  position: {
    lat: 0.0,
    long: 0.0,
  },
  placeId: 'PlaceId',
  rescuerAssigned: null,
  status: EmergencyStatus.PENDING,
  rescuerHidden: [],
};

describe('Emergency Manager', () => {
  let service: EmergencyManagerService;
  let redisService: RedisService;
  let websocketRescuer: RescuerWebsocket;

  beforeEach(async () => {
    jest.mock('ioredis', () => require('ioredis-mock/jest'));
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        // Set up the environment variables.
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
        RedisModule,
        WebsocketModule,
        // Connect to the MongoDB database.
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          dbName: process.env.MONGODB_DATABASE,
        }),
        // Add Event Emitter.
        EventEmitterModule.forRoot(),
        // Get the rescuer model.
      ],
      providers: [
        ReactEmailService,
        EmergencyManagerService,
        {
          provide: getModelToken(Emergency.name),
          useValue: EmergencyModelMock,
        },
        {
          provide: getModelToken(Rescuer.name),
          useValue: RescuerModelMock,
        },
        {
          provide: getModelToken(CallCenter.name),
          useValue: CallCenterModelMock,
        },
      ],
    }).compile();
    service = app.get<EmergencyManagerService>(EmergencyManagerService);
    redisService = app.get<RedisService>(RedisService);
    websocketRescuer = app.get<RescuerWebsocket>(RescuerWebsocket);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test event from event', () => {
    it('emergency created event', async () => {
      // Add fake client to websocket connected
      websocketRescuer.clients.set(RESCUER_MOCK._id, null);

      const event: EmergencyCreatedEvent = {
        callCenter: CALL_CENTER,
        emergency: EMERGENCY,
      };
      const id = RESCUER_MOCK._id;

      await redisService.setStatusOfRescuer(id, Status.AVAILABLE);
      await redisService.setPositionOfRescuer(id, {
        lng: 0.0,
        lat: 0.0,
      });
      await service.onEmergencyCreated(event);

      await redisService.setStatusOfRescuer(id, Status.NOT_AVAILABLE);
      await service.onEmergencyCreated(event);

      await redisService.setStatusOfRescuer(id, Status.AVAILABLE);
      await redisService.deletePositionOfRescuer(id);
      await service.onEmergencyCreated(event);
    });

    it('Get nearest position', async () => {
      const allPositions = [];
      const nearestPosition = await service.getNearestPosition(allPositions);
      expect(nearestPosition).toBeNull();

      const id = RESCUER_MOCK._id;

      await redisService.setStatusOfRescuer(id, Status.AVAILABLE);
      await redisService.setPositionOfRescuer(id, {
        lng: 0.0,
        lat: 0.0,
      });

      const allPositionTwo: RescuerPositionWithId[] = [
        {
          id: id,
          position: {
            lat: 0.0,
            lng: 0.0,
          },
        },
      ];
      const nearestPositionTwo =
        await service.getNearestPosition(allPositionTwo);
      expect(nearestPositionTwo).toStrictEqual(allPositionTwo[0]);
    });

    it('Test timer', async () => {
      const id = RESCUER_MOCK._id;
      await redisService.setStatusOfRescuer(id, Status.AVAILABLE);
      await redisService.setPositionOfRescuer(id, {
        lng: 0.0,
        lat: 0.0,
      });
      const event: EmergencyCreatedEvent = {
        callCenter: CALL_CENTER,
        emergency: EMERGENCY,
      };
      await service.runTimer(event, RESCUER_MOCK);
    });
  });
});
