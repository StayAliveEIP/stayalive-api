import { Test, TestingModule } from '@nestjs/testing';
import { ReactEmailService } from './react-email.service';

describe('ReactEmailService', () => {
  let service: ReactEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReactEmailService],
    }).compile();

    service = module.get<ReactEmailService>(ReactEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
