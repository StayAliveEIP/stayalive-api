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
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from '../../../database/admin.schema';

const adminMockData = {
  id: '60e6f7b3f5b6f0b3f4f9f6e0',
  firstname: 'John',
  lastname: 'Doe',
  email: {
    email: 'john@doe.com',
    verified: true,
  },
};

class AdminModelMock {
  constructor(private data) {
    this.data = data;
  }

  static findOne = jest.fn().mockImplementation(() => {
    return new AdminModelMock(adminMockData).data;
  });

  static find = jest.fn().mockImplementation(() => {
    return [new AdminModelMock(adminMockData).data];
  });

  static save = jest.fn().mockImplementation(() => {
    return new AdminModelMock(adminMockData).data;
  });
}

describe('AccountAdminController', () => {
  let accountController: AccountAdminController;
  let accountService: AccountAdminService;

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
        MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
      ],
      controllers: [AccountAdminController],
      providers: [
        AccountAdminService,
        {
          provide: getModelToken(Admin.name),
          useValue: AdminModelMock,
        },
        ReactEmailService,
      ],
    }).compile();
    accountService = module.get<AccountAdminService>(AccountAdminService);
    accountController = module.get<AccountAdminController>(
      AccountAdminController,
    );
  });

  it('should be defined', () => {
    expect(accountController).toBeDefined();
  });

  describe('info', () => {
    it('should return account information', async () => {
      // Execute the test
      const id = new Types.ObjectId('60e6f7b3f5b6f0b3f4f9f6e0');
      const result: InfoResponse = {
        id: id.toString(),
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@doe.com',
        emailVerified: true,
        profilePictureUrl: undefined,
      };

      expect(await accountController.info(id)).toStrictEqual(result);
    });
  });

  describe('all', () => {
    it('should return all admin accounts', async () => {
      const id = new Types.ObjectId('60e6f7b3f5b6f0b3f4f9f6e0');
      const result = [
        {
          id: id.toString(),
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@doe.com',
          emailVerified: true,
          profilePictureUrl: undefined,
        },
      ];
      expect(await accountController.all()).toStrictEqual(result);
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

      expect(await accountController.new(requestBody)).toStrictEqual(
        mockResponse,
      );
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

      expect(await accountController.delete(requestBody)).toBe(mockResponse);
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

      expect(await accountController.deleteMyAccount(userId, requestBody)).toBe(
        mockResponse,
      );
    });
  });

  /*describe('Upload Profile Picture', () => {
    it('should upload a profile picture', async () => {
      const userId = new Types.ObjectId();
      //fake File of type File[]
      const file = {
        fieldname: 'file',
        originalname: 'profile.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        destination: 'uploads/',
        filename: 'profile.jpg',
      };
      const mockResponse: SuccessMessage = {
        message: 'Profile picture uploaded.',
      };

      jest
        .spyOn(accountService, 'uploadProfilePicture')
        .mockResolvedValue(mockResponse);

      expect(await accountController.uploadProfilePicture(file, userId)).toBe(
        mockResponse,
      );
    });
  });*/

  describe('Delete Profile Picture', () => {
    it('should delete a profile picture', async () => {
      const userId = new Types.ObjectId();
      const mockResponse: SuccessMessage = {
        message: 'Profile picture deleted.',
      };

      jest
        .spyOn(accountService, 'deleteProfilePicture')
        .mockResolvedValue(mockResponse);

      expect(await accountController.deleteProfilePicture(userId)).toBe(
        mockResponse,
      );
    });
  });

  describe('Change password', () => {
    it('should change the password', async () => {
      const userId = new Types.ObjectId();
      const requestBody = {
        oldPassword: 'password',
        newPassword: 'newPassword',
      };
      const mockResponse: SuccessMessage = {
        message: 'Password changed.',
      };

      jest
        .spyOn(accountService, 'changePassword')
        .mockResolvedValue(mockResponse);

      expect(await accountController.changePassword(userId, requestBody)).toBe(
        mockResponse,
      );
    });
  });

  describe('Change email', () => {
    it('should change the email', async () => {
      const userId = new Types.ObjectId();
      const requestBody = {
        email: 'bastiencantet@outlook.fr',
        password: 'password',
      };
      const mockResponse: SuccessMessage = {
        message: 'Email changed.',
      };

      jest.spyOn(accountService, 'changeEmail').mockResolvedValue(mockResponse);

      expect(await accountController.changeEmail(userId, requestBody)).toBe(
        mockResponse,
      );
    });
  });

  // Additional tests can be added as needed for more thorough coverage
});
