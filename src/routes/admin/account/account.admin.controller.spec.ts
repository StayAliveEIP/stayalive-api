import { Test, TestingModule } from '@nestjs/testing';
import { AccountAdminController } from './account.admin.controller';
import { AccountAdminService } from './account.admin.service';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { Types } from 'mongoose';
import {
  NewRequest,
  InfoResponse,
  DeleteAdminRequest,
  DeleteMyAccountRequest,
} from './account.admin.dto';
import { SuccessMessage } from '../../../dto.dto';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../../validation/env.validation';

describe('AccountAdminController', () => {
  let controller: AccountAdminController;
  let accountService: AccountAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountAdminController],
      imports: [
        // Set up the environment variables.
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
      ],
      providers: [
        {
          provide: AccountAdminService,
          useValue: {
            info: jest.fn(),
            all: jest.fn(),
            new: jest.fn(),
            delete: jest.fn(),
            deleteMyAccount: jest.fn(),
          },
        },
        ReactEmailService,
      ],
    }).compile();

    controller = module.get<AccountAdminController>(AccountAdminController);
    accountService = module.get<AccountAdminService>(AccountAdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('index', () => {
    it('should return account information', async () => {
      const userId = new Types.ObjectId();
      const mockResponse: InfoResponse = {
        id: userId.toHexString(),
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@doe.com',
        emailVerified: true,
      };

      jest.spyOn(accountService, 'info').mockResolvedValue(mockResponse);

      expect(await controller.index(userId)).toBe(mockResponse);
    });
  });

  describe('all', () => {
    it('should return all admin accounts', async () => {
      const mockResponse: InfoResponse[] = [];
      jest.spyOn(accountService, 'all').mockResolvedValue(mockResponse);

      expect(await controller.all()).toBe(mockResponse);
    });
  });

  describe('new', () => {
    it('should create a new admin account', async () => {
      const requestBody: NewRequest = {
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane@doe.com',
      };
      const mockResponse: SuccessMessage = {
        message: 'Account created for jane@doe.com.',
      };

      jest.spyOn(accountService, 'new').mockResolvedValue(mockResponse);

      expect(await controller.new(requestBody)).toBe(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete an admin account', async () => {
      const requestBody: DeleteAdminRequest = {
        id: '60e6f7b3f5b6f0b3f4f9f6e0',
      };
      const mockResponse: SuccessMessage = {
        message: 'Le compte administrateur a été supprimé.',
      };

      jest.spyOn(accountService, 'delete').mockResolvedValue(mockResponse);

      expect(await controller.delete(requestBody)).toBe(mockResponse);
    });
  });

  describe('deleteMyAccount', () => {
    it('should delete the logged-in admin account', async () => {
      const userId = new Types.ObjectId();
      const requestBody: DeleteMyAccountRequest = {
        password: 'password',
      };
      const mockResponse: SuccessMessage = {
        message: 'Votre compte a été supprimé.',
      };

      jest
        .spyOn(accountService, 'deleteMyAccount')
        .mockResolvedValue(mockResponse);

      expect(await controller.deleteMyAccount(userId, requestBody)).toBe(
        mockResponse,
      );
    });
  });

  // Additional tests can be added as needed for more thorough coverage
});
