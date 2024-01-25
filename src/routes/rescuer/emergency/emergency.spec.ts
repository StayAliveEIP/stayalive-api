import { EmergencyController } from './emergency.controller';
import { EmergencyService } from './emergency.service';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Types } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { Emergency, EmergencySchema } from '../../../database/emergency.schema';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';

const EmergencyHistoryMock = [
  {
    _id: '65a85fda8590c63d49fc84c4',
    info: 'string',
    position: {
      lat: 123,
      long: 123,
      _id: {
        $oid: '65a85fda8590c63d49fc84c5',
      },
    },
    address: '17 rue des Lilas , Paris',
    callCenterId: {
      $oid: '659186382823853a4345289a',
    },
    status: 'ASSIGNED',
    rescuerAssigned: {
      $oid: '656e753981729a32ca66aac8',
    },
    rescuerHidden: [],
  },
];

const EmergencyMockAccept = {
  _id: '65a85fda8590c63d49fc84c4',
  info: 'string',
  position: {
    lat: 123,
    long: 123,
    _id: '65a85fda8590c63d49fc84c5',
  },
  address: '17 rue des Lilas , Paris',
  callCenterId: {
    $oid: '659186382823853a4345289a',
  },
  status: 'PENDING',
  rescuerAssigned: {
    $oid: '656e753981729a32ca66aac8',
  },
  rescuerHidden: [],
};

const RescuerMock = {
  _id: {
    $oid: '64c0ea5b7efe61feb45b9ab2',
  },
  firstname: 'test',
  lastname: 'TEST',
  email: {
    email: 'test+708594@test.net',
    lastCodeSent: null,
    code: null,
    verified: false,
  },
  phone: {
    phone: '0102030405',
    lastCodeSent: null,
    code: null,
    verified: false,
  },
  password: {
    password: '$2b$10$39WjCLWBHKtotXb.Y4lHauCUhcZ0MQ5doTTD3.Gb9Y4V6smgKLtOm',
    token: null,
    lastTokenSent: null,
    lastChange: null,
  },
  available: false,
};

const CallCenterMock = {
  _id: '659186382823853a4345289a',
  name: 'test',
  phone: '0652173532',
  email: {
    email: 'bastiencantet@outlook.fr',
    lastCodeSent: null,
    code: null,
    verified: true,
  },
  password: {
    password: '$2b$10$R0gEM3QMJZkAhVqtdUY5zOgEbvJh.hDSAgi4Vbc7ef6i5Ux3tEnLG',
    token: null,
    lastTokenSent: null,
    lastChange: null,
  },
  address: {
    street: 'derde',
    city: 'ded',
    zip: '7373',
  },
};

class EmergencyModelMock {
  constructor(public data) {}

  static find = jest.fn().mockImplementation(() => {
    return {
      exec: jest
        .fn()
        .mockResolvedValue(new EmergencyModelMock(EmergencyHistoryMock).data),
    };
  });

  static findById = jest.fn().mockImplementation(() => {
    return new EmergencyModelMock(EmergencyMockAccept).data;
  });

  static save = jest.fn().mockResolvedValue(EmergencyMockAccept);

  static findByIdAndUpdate = jest.fn().mockResolvedValue(EmergencyMockAccept);
}

class RescuerModelMock {
  constructor(private data) {}
  static findById = jest.fn().mockImplementation(() => {
    return new RescuerModelMock(RescuerMock);
  });
}

class CallCenterModelMock {
  constructor(private data) {}
  static findById = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(CallCenterMock).data;
  });
}

describe('EmergencyController', () => {
  let emergencyController: EmergencyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
        MongooseModule.forRoot(process.env.MONGODB_URI, {
          dbName: process.env.MONGODB_DATABASE,
        }),
        MongooseModule.forFeature([
          { name: Rescuer.name, schema: RescuerSchema },
          { name: Emergency.name, schema: EmergencySchema },
          { name: CallCenter.name, schema: CallCenterSchema },
        ]),
      ],
      controllers: [EmergencyController],
      providers: [
        EmergencyService,
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
        EventEmitter2,
      ],
    }).compile();

    emergencyController = app.get<EmergencyController>(EmergencyController);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(emergencyController).toBeDefined();
  });

  describe('History of the emergencies', () => {
    it('Get the history of the emergencies', async () => {
      const result = await emergencyController.getEmergencyHistory(
        new Types.ObjectId('5f9d88b9d4f0f1b1a8c9d9a0'),
      );
      expect(result).toStrictEqual([
        {
          id: '65a85fda8590c63d49fc84c4',
          info: 'string',
          address: '17 rue des Lilas , Paris',
          status: 'ASSIGNED',
        },
      ]);
    });

    it('Refuse the emergency', async () => {
      const result = await emergencyController.refuseEmergency(
        new Types.ObjectId('5f9d88b9d4f0f1b1a8c9d9a0'),
        { id: '65a85fda8590c63d49fc84c4' },
      );

      expect(result).toStrictEqual({
        message: "Vous avez bien refusé l'urgence",
      });
    });
  });
});
