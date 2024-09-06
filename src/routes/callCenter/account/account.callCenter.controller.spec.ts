import { AccountAdminController } from '../../admin/account/account.admin.controller';
import { AccountAdminService } from '../../admin/account/account.admin.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../../database/admin.schema';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { AccountCallCenterController } from './account.callCenter.controller';
import { AccountCallCenterService } from './account.callCenter.service';
import {
  CallCenter,
  CallCenterSchema,
} from '../../../database/callCenter.schema';
import { Types } from 'mongoose';

const callCenterMockData = {
  id: '60e6f7b3f5b6f0b3f4f9f6e0',
  name: 'John Doe',
  email: {
    email: 'johndoe@gmail.com',
    verified: true,
  },
  profilePictureUrl: undefined,
  address: {
    city: 'Test City',
    zip: '12345',
    street: 'Test Street',
  },
};

class CallCenterModelMock {
  constructor(private data) {
    this.data = data;
  }

  static findOne = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(callCenterMockData).data;
  });

  static find = jest.fn().mockImplementation(() => {
    return [new CallCenterModelMock(callCenterMockData).data];
  });

  static save = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(callCenterMockData).data;
  });

  static findById = jest.fn().mockImplementation(() => {
    return new CallCenterModelMock(callCenterMockData).data;
  });
}

describe('AccountCallCenterController', () => {
  let accountController: AccountCallCenterController;
  let accountService: AccountCallCenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
          { name: CallCenter.name, schema: CallCenterSchema },
          { name: Admin.name, schema: AdminSchema },
        ]),
      ],
      controllers: [AccountCallCenterController],
      providers: [
        AccountCallCenterService,
        {
          provide: getModelToken(CallCenter.name),
          useValue: CallCenterModelMock,
        },
        ReactEmailService,
        AccountAdminService,
      ],
    }).compile();
    accountService = module.get<AccountCallCenterService>(
      AccountCallCenterService,
    );
    accountController = module.get<AccountCallCenterController>(
      AccountCallCenterController,
    );
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });

  describe('info', () => {
    it('should return the call center information', async () => {
      const userId = new Types.ObjectId('60e6f7b3f5b6f0b3f4f9f6e0');

      const result = {
        name: 'John Doe',
        phone: undefined,
        email: {
          email: 'johndoe@gmail.com',
          verified: true,
        },
        profilePictureUrl: undefined,
        address: {
          city: 'Test City',
          zip: '12345',
          street: 'Test Street',
        },
      };

      const callCenterInfo = await accountController.info(userId);
      expect(callCenterInfo).toEqual(result);
    });
  });

  describe('updateName', () => {
    it('should update the call center name', async () => {
      const userId = new Types.ObjectId('60e6f7b3f5b6f0b3f4f9f6e0');
      const body = {
        name: 'John Doe',
      };

      const result = {
        message: 'The call center name was updated.',
      };

      jest.spyOn(accountService, 'updateName').mockResolvedValue(result);

      const updateName = await accountController.updateName(userId, body);
      expect(updateName).toEqual(result);
    });
  });

  describe('updateAddress', () => {
    it('should update the call center address', async () => {
      const userId = new Types.ObjectId('60e6f7b3f5b6f0b3f4f9f6e0');
      const body = {
        address: '1234 Test Street',
        street: 'Test Street',
        city: 'Test City',
        zip: '12345',
      };

      const result = {
        message: 'The call center address was updated.',
      };

      jest.spyOn(accountService, 'updateAddress').mockResolvedValue(result);

      const updateAddress = await accountController.updateAddress(userId, body);
      expect(updateAddress).toEqual(result);
    });
  });
});
