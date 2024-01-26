import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../validation/env.validation';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { CallCenter } from '../../database/callCenter.schema';
import { ReactEmailService } from '../react-email/react-email.service';
import mongoose, { Types } from 'mongoose';
import { EmergencyManagerService } from './emergencyManager.service';
import { Emergency, EmergencyStatus } from '../../database/emergency.schema';
import { WebsocketModule } from '../../websocket/websocket.module';
import { RedisModule } from '../redis/redis.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Rescuer } from '../../database/rescuer.schema';
import { EmergencyCreatedEvent } from './emergencyManager.dto';
import { RescuerPositionWithId } from '../redis/redis.service';

const RESCUER_MOCK: Rescuer = {
  _id: new Types.ObjectId(),
  email: {
    email: 'test@test.net',
    code: '123456',
    lastCodeSent: null,
    verified: true,
  },
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
    return new RescuerModelMock(RESCUER_MOCK);
  });
}

class EmergencyModelMock {
  constructor(public data: Emergency) {}
  static findById = jest.fn().mockImplementation(() => {
    return new EmergencyModelMock(EMERGENCY);
  });
}

class CallCenterModelMock {
  constructor(public data: CallCenter) {}
  static findById = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(CALL_CENTER);
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
  rescuerAssigned: null,
  status: EmergencyStatus.PENDING,
  rescuerHidden: [],
};

describe('Emergency Manager', () => {
  let service: EmergencyManagerService;

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
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Test event from event', () => {
    it('emergency created event', async () => {
      const event: EmergencyCreatedEvent = {
        callCenter: CALL_CENTER,
        emergency: EMERGENCY,
      };
      await service.onEmergencyCreated(event);
    });

    it('Get nearest position', async () => {
      const allPositions = [];
      const nearestPosition = await service.getNearestPosition(allPositions);
      expect(nearestPosition).toBeNull();

      const allPositionTwo: RescuerPositionWithId[] = [
        {
          id: new Types.ObjectId(),
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
  });
});
