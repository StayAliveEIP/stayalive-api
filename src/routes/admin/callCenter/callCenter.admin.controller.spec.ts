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
      ],
      providers: [
        {
          provide: CallCenterAdminService,
          useValue: {
            new: jest.fn(),
            info: jest.fn(),
            all: jest.fn(),
            delete: jest.fn(),
          },
        },
        ReactEmailService,
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

      jest.spyOn(service, 'new').mockResolvedValue(expectedResponse);

      expect(await controller.new(request)).toEqual(expectedResponse);
    });
  });

  describe('info', () => {
    it('should return call center information', async () => {
      const id = 'testId';
      const expectedResponse: CallCenterInfoDto = {
        id: id,
        name: 'Test Call Center',
        phone: '1234567890',
        email: {
          email: 'test@example.com',
          verified: true,
          lastCodeSent: new Date(),
        },
        address: {
          street: '123 Test St',
          city: 'Test City',
          zip: '12345',
        },
      };

      jest.spyOn(service, 'info').mockResolvedValue(expectedResponse);

      expect(await controller.info(id)).toEqual(expectedResponse);
    });
  });

  describe('all', () => {
    it('should return all call center accounts', async () => {
      const mockCallCenterInfo: CallCenterInfoDto[] = [
        {
          id: '1',
          name: 'Call Center 1',
          phone: '1234567890',
          email: {
            email: 'email1@callcenter.com',
            verified: true,
            lastCodeSent: new Date(),
          },
          address: {
            street: 'Street 1',
            city: 'City 1',
            zip: 'Zip1',
          },
        },
      ];

      jest.spyOn(service, 'all').mockResolvedValue(mockCallCenterInfo);

      const result = await controller.all();
      expect(result).toEqual(mockCallCenterInfo);
      expect(service.all).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a call center account', async () => {
      const mockDeleteRequest: DeleteCallCenterRequest = {
        id: '1',
      };
      const expectedResponse: SuccessMessage = {
        message: "Le centre d'appel a été supprimé avec succès.",
      };

      jest.spyOn(service, 'delete').mockResolvedValue(expectedResponse);

      const result = await controller.delete(mockDeleteRequest);
      expect(result).toEqual(expectedResponse);
      expect(service.delete).toHaveBeenCalledWith(mockDeleteRequest);
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
