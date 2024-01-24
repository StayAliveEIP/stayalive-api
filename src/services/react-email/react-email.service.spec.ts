import { Test, TestingModule } from '@nestjs/testing';
import { ReactEmailService } from './react-email.service';
import { ConfigModule } from '@nestjs/config';
import { envValidation } from '../../validation/env.validation';

describe('ReactEmailService', () => {
  let service: ReactEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: envValidation,
        }),
      ],

      providers: [ReactEmailService],
    }).compile();

    service = module.get<ReactEmailService>(ReactEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
