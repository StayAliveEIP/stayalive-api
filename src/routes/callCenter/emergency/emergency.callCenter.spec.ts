import { Test, TestingModule } from '@nestjs/testing';
import { EmergencyCallCenterController } from './emergency.callCenter.controller';
import { EmergencyCallCenterService } from './emergency.callCenter.service';
import { ReactEmailService } from '../../../services/react-email/react-email.service';
import { Types } from 'mongoose';
import {
  CreateNewEmergencyRequest,
  EmergencyInfoResponse,
} from './emergency.callCenter.dto';

describe('EmergencyCallCenterController', () => {
  let controller: EmergencyCallCenterController;
  let emergencyService: EmergencyCallCenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmergencyCallCenterController],
      providers: [
        {
          provide: EmergencyCallCenterService,
          useValue: {
            getEmergency: jest.fn(),
            createEmergency: jest.fn(),
          },
        },
        {
          provide: ReactEmailService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<EmergencyCallCenterController>(
      EmergencyCallCenterController,
    );
    emergencyService = module.get<EmergencyCallCenterService>(
      EmergencyCallCenterService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getEmergency', () => {
    it('should return an array of emergencies', async () => {
      const userId = new Types.ObjectId();
      const result: EmergencyInfoResponse[] = [];
      jest
        .spyOn(emergencyService, 'getEmergency')
        .mockImplementation(async () => result);

      expect(await controller.getEmergency(userId)).toBe(result);
    });
  });

  describe('createEmergency', () => {
    it('should create a new emergency', async () => {
      const userId = new Types.ObjectId();
      const emergencyRequest: CreateNewEmergencyRequest = {
        info: 'Urgent help needed',
        address: '123 Main St',
      };
      const response: EmergencyInfoResponse = {
        id: new Types.ObjectId(),
        status: 'PENDING',
        address: emergencyRequest.address,
        info: emergencyRequest.info,
        rescuerAssigned: null,
      };
      jest
        .spyOn(emergencyService, 'createEmergency')
        .mockImplementation(async () => response);

      expect(await controller.createEmergency(userId, emergencyRequest)).toBe(
        response,
      );
    });
  });
});
