import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyCallCenterController } from './emergency.callCenter.controller';
import { EmergencyCallCenterService } from './emergency.callCenter.service';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { Types } from 'mongoose';
import { CreateNewEmergencyRequest } from './emergency.callCenter.dto';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { Rescuer, RescuerSchema } from '../../../database/rescuer.schema';
import { Emergency, EmergencySchema } from '../../../database/emergency.schema';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';

const CallCenterMock = {
  id: '659186382823853a4345289a',
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

const CallCenterMockArray = [
  {
    id: '659186382823853a4345289a',
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
  },
];

class CallCenterModelMock {
  constructor(private data) {}
  static findById = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(CallCenterMock).data;
  });
  static findOne = jest.fn().mockImplementation(() => {
    return null;
  });
  static create = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(CallCenterMock).data;
  });
  static find = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(CallCenterMockArray).data;
  });
  static deleteOne = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(CallCenterMock).data;
  });
}

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

class EmergencyMock {
  constructor(private data) {}
  static save = jest.fn().mockResolvedValue(EmergencyMockAccept);
  static create = jest.fn().mockResolvedValue(EmergencyMockAccept);
  static aggregate = jest.fn().mockImplementation(() => {
    return {
      exec: jest.fn().mockResolvedValue([]),
    };
  });
}

describe('EmergencyCallCenterController', () => {
  let controller: EmergencyCallCenterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          { name: Admin.name, schema: AdminSchema },
        ]),
      ],
      controllers: [EmergencyCallCenterController],
      providers: [
        EmergencyCallCenterService,
        ReactEmailService,
        EventEmitter2,
        {
          provide: 'CallCenterModel',
          useValue: CallCenterModelMock,
        },
        {
          provide: 'EmergencyModel',
          useValue: EmergencyMock,
        },
      ],
    }).compile();

    controller = module.get<EmergencyCallCenterController>(
      EmergencyCallCenterController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEmergency', () => {
    it('should return an array of emergencies', async () => {
      const userId = new Types.ObjectId();
      const result = await controller.getEmergency(userId);
      expect(result).toEqual([]);
    });
  });

  describe('createEmergency', () => {
    it('should create a new emergency', async () => {
      const userId = new Types.ObjectId();
      const emergencyRequest: CreateNewEmergencyRequest = {
        info: 'Urgent help needed',
        address: '123 Main St',
      };
      const result = await controller.createEmergency(userId, emergencyRequest);
      expect(result).toEqual({
        id: '65a85fda8590c63d49fc84c4',
      });
    });
  });
});
