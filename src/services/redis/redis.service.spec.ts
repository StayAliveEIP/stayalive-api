import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { Types } from 'mongoose';
import { Status } from '../../routes/rescuer/status/status.dto';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    jest.mock('ioredis', () => require('ioredis-mock/jest'));
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();
    service = module.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should set and get the status of a rescuer', async () => {
    const rescuerId = new Types.ObjectId();
    const status = Status.AVAILABLE;
    await service.setStatusOfRescuer(rescuerId, status);
    const retrievedStatus = await service.getStatusOfRescuer(rescuerId);
    expect(retrievedStatus).toBe(status);
  });

  it('should delete the status of a rescuer', async () => {
    const rescuerId = new Types.ObjectId();
    await service.setStatusOfRescuer(rescuerId, Status.AVAILABLE);
    await service.deleteStatusOfRescuer(rescuerId);
    const status = await service.getStatusOfRescuer(rescuerId);
    expect(status).toBeNull();
  });

  it('should set, get and delete the position of a rescuer', async () => {
    const rescuerId = new Types.ObjectId();
    const position = { lat: 10, lng: 20 };
    await service.setPositionOfRescuer(rescuerId, position);
    const retrievedPosition = await service.getPositionOfRescuer(rescuerId);
    expect(retrievedPosition).toEqual(position);
    await service.deletePositionOfRescuer(rescuerId);
    const deletedPosition = await service.getPositionOfRescuer(rescuerId);
    expect(deletedPosition).toBeNull();
  });

  it('should retrieve all available rescuers', async () => {
    const rescuer1 = new Types.ObjectId();
    const rescuer2 = new Types.ObjectId();
    await service.setStatusOfRescuer(rescuer1, Status.AVAILABLE);
    await service.setStatusOfRescuer(rescuer2, Status.NOT_AVAILABLE);
    const availableRescuers = await service.getAllRescuerAvailable();
    expect(availableRescuers).toContainEqual(rescuer1);
    expect(availableRescuers).not.toContainEqual(rescuer2);
  });

  it('should retrieve all positions', async () => {
    const rescuer1 = new Types.ObjectId();
    const position1 = { lat: 10, lng: 20 };
    await service.setPositionOfRescuer(rescuer1, position1);
    const allPositions = await service.getAllPositions();
    expect(allPositions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: rescuer1, position: position1 }),
      ]),
    );
  });
});
