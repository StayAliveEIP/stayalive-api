import { Test, TestingModule } from '@nestjs/testing';
import { CallCenterAdminController } from './callCenter.admin.controller';
import { CallCenterAdminService } from './callCenter.admin.service';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import {
  NewCallCenterRequest,
  CallCenterInfoDto,
  DeleteCallCenterRequest,
} from './callCenter.admin.dto';
import { SuccessMessage } from '../../../dto.dto';
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

describe('CallCenterAdminController', () => {
  let controller: CallCenterAdminController;
  let service: CallCenterAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CallCenterAdminController],
      imports: [
        // Set up the environment variables.
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
      providers: [
        {
          provide: 'CallCenterModel',
          useValue: CallCenterModelMock,
        },
        ReactEmailService,
        CallCenterAdminService,
      ],
    }).compile();

    controller = module.get<CallCenterAdminController>(
      CallCenterAdminController,
    );
    service = module.get<CallCenterAdminService>(CallCenterAdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('new', () => {
    it('should create a new call center', async () => {
      const request: NewCallCenterRequest = {
        name: 'Test Call Center',
        email: 'test@example.com',
        phone: '1234567890',
        address: {
          street: '123 Test St',
          city: 'Test City',
          zip: '12345',
        },
      };
      const expectedResponse: SuccessMessage = {
        message: 'Le compte a été créé avec succès.',
      };

      const result = await controller.new(request);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('info', () => {
    it('should return call center information', async () => {
      const id = '659186382823853a4345289a';
      const expectedResponse: CallCenterInfoDto = {
        id: id,
        name: 'test',
        phone: '0652173532',
        email: {
          email: 'bastiencantet@outlook.fr',
          verified: true,
          lastCodeSent: null,
        },
        address: {
          street: 'derde',
          city: 'ded',
          zip: '7373',
        },
      };

      const result = await controller.info(id);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('all', () => {
    it('should return all call center accounts', async () => {
      const expectedResponse = [
        {
          id: '659186382823853a4345289a',
          name: 'test',
          phone: '0652173532',
          email: {
            email: 'bastiencantet@outlook.fr',
            verified: true,
            lastCodeSent: null,
          },
          address: { zip: '7373', city: 'ded', street: 'derde' },
        },
      ];

      const result = await controller.all();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('delete', () => {
    it('should delete a call center account', async () => {
      const mockDeleteRequest: DeleteCallCenterRequest = {
        id: '659186382823853a4345289a',
      };
      const expectedResponse: SuccessMessage = {
        message: "Le centre d'appel a été supprimé avec succès.",
      };

      const result = await controller.delete(mockDeleteRequest);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle errors when deleting a call center account', async () => {
      const mockDeleteRequest: DeleteCallCenterRequest = {
        id: 'invalidId',
      };

      jest.spyOn(service, 'delete').mockImplementation(() => {
        throw new Error('Error deleting the call center');
      });

      await expect(controller.delete(mockDeleteRequest)).rejects.toThrow(
        'Error deleting the call center',
      );
    });
  });

  // Additional tests can be added as needed for more thorough coverage
});
